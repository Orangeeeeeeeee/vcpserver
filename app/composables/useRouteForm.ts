import { useRegle } from '@regle/core';
import { withMessage, required, requiredIf } from '@regle/rules';
import { ROUTE_POINT_RADIUS, ROUTE_PICK_SNAP_KM } from '~/constants/route-form';
import { nearestMockAddress } from '~/mocks/routes';
import { haversineKm } from '~/utils/geo';
import type {
    Route,
    RouteCoords,
    RoutePoint,
    RoutePointKind,
    RoutePointType
} from '~/types/route';

/** Tab keys of the route form panel */
export type RouteFormTabKey = 'general' | 'points' | 'assignment';

/** One editable route point of the «Точки маршруту» tab */
export interface RoutePointFormState {
    id: string;
    address: string;
    /** Point location; null until picked from the catalog or the map */
    coords: RouteCoords | null;
    name: string;
    /** Intermediate points only */
    type: RoutePointType | null;
    /** Arrival detection radius in meters */
    radius: number;
    /** The segment leading to this point is a straight line */
    directPath: boolean;
    /** Travel time from the previous point; a time-only Date for DatePicker */
    timeToPoint: Date | null;
}

/** Scalar fields of the route form */
export interface RouteFormState {
    companies: string[];
    name: string;
    active: boolean;
    scheduled: boolean;
    startAt: Date | null;
    errorCount: number | null;
    passenger: boolean;
    intercity: boolean;
    reverseCalculation: boolean;
    /** Single fare price; used when the route is not intercity */
    singlePrice: number | null;
    vehicleIds: string[];
    groupIds: string[];
}

/** A route point participating in the intercity tariff matrix */
export interface RouteTariffPoint {
    id: string;
    /** Point name, falling back to its address */
    label: string;
}

/** All fare inputs of one tariff matrix origin (accordion section) */
export interface RouteTariffGroup {
    from: RouteTariffPoint;
    /** Forward-ordered targets with their segment price keys */
    targets: { key: string; to: RouteTariffPoint }[];
}

/** Raw shape of one entry of an imported points JSON file */
interface ImportedPoint {
    address: string;
    lat: number;
    lng: number;
    name?: string;
    type?: RoutePointType;
    radius?: number;
    directPath?: boolean;
    /** Travel time from the previous point as "HH:mm" */
    timeToPoint?: string;
}

/** Builds the empty form state of the create page */
const initialState = (): RouteFormState => ({
    companies: [],
    name: '',
    active: true,
    scheduled: true,
    startAt: null,
    errorCount: null,
    passenger: false,
    intercity: false,
    reverseCalculation: false,
    singlePrice: null,
    vehicleIds: [],
    groupIds: []
});

/** Valid values of the imported point `type` field */
const POINT_TYPES: RoutePointType[] = [
    'stop',
    'busStation',
    'checkpoint',
    'technicalStop',
    'rest'
];

/**
 * State, validation and submit logic of the route create form. Created once
 * in the route create page and shared with the panel and the map via
 * provide/inject.
 *
 * Note: the return type is intentionally inferred (see
 * {@link UseRouteFormReturn}) so the regle `r$` type flows through without
 * hand-typing it.
 * @returns {UseRouteFormReturn} Shared form state, validation and helpers
 */
export const useRouteForm = () => {
    const { createRoute } = useRoutes();

    /** Monotonic id source of the points created by this form instance */
    let pointSeq = 0;
    const nextPointId = (): string => `p${++pointSeq}`;

    /** Builds an empty point; start/finish points are created the same way */
    const emptyPoint = (): RoutePointFormState => ({
        id: nextPointId(),
        address: '',
        coords: null,
        name: '',
        type: null,
        radius: ROUTE_POINT_RADIUS.default,
        directPath: false,
        timeToPoint: null
    });

    const state = reactive<RouteFormState>(initialState());

    /** Ordered points: index 0 is the start, the last one is the finish */
    const points = ref<RoutePointFormState[]>([emptyPoint(), emptyPoint()]);

    /**
     * Intercity fares keyed "{fromPointId}-{toPointId}". Kept for every pair
     * ever priced so edits to the points don't drop entered values; pruned to
     * the current forward pairs on submit.
     */
    const segmentPrices = reactive<Record<string, number | null>>({});

    /** Point awaiting a location pick on the map; null when not picking */
    const pickingPointId = ref<string | null>(null);

    const { r$ } = useRegle(
        state,
        {
            companies: {
                required: withMessage(required, 'validation.required')
            },
            name: { required: withMessage(required, 'validation.required') },
            startAt: {
                required: withMessage(
                    requiredIf(() => state.scheduled),
                    'validation.required'
                )
            }
        },
        { lazy: true }
    );

    /** A start date only makes sense for a scheduled route */
    watch(
        () => state.scheduled,
        (scheduled): void => {
            if (!scheduled) state.startAt = null;
        }
    );

    /** The passenger sub-toggles reset together with their master toggle */
    watch(
        () => state.passenger,
        (passenger): void => {
            if (passenger) return;
            state.intercity = false;
            state.reverseCalculation = false;
        }
    );

    /**
     * Role of the point at the given position.
     * @param index - Index within {@link points}.
     */
    const pointKind = (index: number): RoutePointKind => {
        if (index === 0) return 'start';
        if (index === points.value.length - 1) return 'finish';
        return 'intermediate';
    };

    /**
     * Inserts an empty intermediate point right after the given position
     * (each «Додати проміжну точку» button inserts into its own slot).
     * @param afterIndex - Index of the point the new one follows.
     */
    const addIntermediate = (afterIndex: number): void => {
        const next = [...points.value];
        next.splice(afterIndex + 1, 0, emptyPoint());
        points.value = next;
    };

    /** Removes the intermediate point with the given id */
    const removePoint = (id: string): void => {
        points.value = points.value.filter((point) => point.id !== id);
        if (pickingPointId.value === id) pickingPointId.value = null;
    };

    /** Starts the pick-on-map mode for the given point */
    const requestPick = (id: string): void => {
        pickingPointId.value = id;
    };

    /** Cancels the pick-on-map mode */
    const cancelPick = (): void => {
        pickingPointId.value = null;
    };

    /**
     * Applies a map click to the point awaiting a pick: stores the location
     * and fills the address from the mock catalog when one is close enough,
     * otherwise with formatted coordinates.
     * @param coords - Clicked location as [lat, lng].
     */
    const applyPick = (coords: RouteCoords): void => {
        const point = points.value.find((p) => p.id === pickingPointId.value);
        if (!point) return;
        point.coords = coords;
        const nearest = nearestMockAddress(coords, ROUTE_PICK_SNAP_KM);
        point.address =
            nearest?.label ??
            `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`;
        pickingPointId.value = null;
    };

    /**
     * Straight-line distance of the segment ending at the given point.
     * @param index - Index of the segment's end point.
     * @returns {number | null} Kilometers, or null when a location is missing.
     */
    const segmentDistanceKm = (index: number): number | null => {
        const from = points.value[index - 1]?.coords;
        const to = points.value[index]?.coords;
        if (!from || !to) return null;
        return Math.round(haversineKm(from, to));
    };

    /** Display label of a point in the tariff matrix */
    const pointLabel = (point: RoutePointFormState): string =>
        point.name.trim() || point.address.trim();

    /** Points participating in the intercity tariff matrix (labelled ones) */
    const tariffPoints = computed<RouteTariffPoint[]>(() =>
        points.value
            .filter((point) => pointLabel(point).length > 0)
            .map((point) => ({ id: point.id, label: pointLabel(point) }))
    );

    /** Builds the "{fromId}-{toId}" key of a segment price */
    const segmentKey = (fromId: string, toId: string): string =>
        `${fromId}-${toId}`;

    /**
     * Tariff matrix as accordion groups: every labelled point except the last
     * gets a section with fares to each of its forward points.
     */
    const tariffGroups = computed<RouteTariffGroup[]>(() =>
        tariffPoints.value.slice(0, -1).map((from, index) => ({
            from,
            targets: tariffPoints.value.slice(index + 1).map((to) => ({
                key: segmentKey(from.id, to.id),
                to
            }))
        }))
    );

    /** True when every point of the route has an address */
    const pointsComplete = computed<boolean>(() =>
        points.value.every((point) => point.address.trim().length > 0)
    );

    /** Reactive submit gate: required fields and complete points */
    const canSubmit = computed<boolean>(
        () => !r$.$invalid && pointsComplete.value
    );

    /** Tab holding the first invalid field, for the jump on failed submit */
    const firstInvalidTab = (): RouteFormTabKey =>
        r$.$invalid ? 'general' : 'points';

    /**
     * Replaces the route points with the content of an imported JSON file.
     *
     * Expected format — an array of at least two points ordered
     * start → finish:
     * `[{ "address": string, "lat": number, "lng": number, "name"?: string,
     * "type"?: "stop" | "busStation" | "checkpoint" | "technicalStop" |
     * "rest", "radius"?: number, "directPath"?: boolean,
     * "timeToPoint"?: "HH:mm" }]`
     * @param raw - Parsed JSON content of the file.
     * @returns {boolean} False when the content doesn't match the format.
     */
    const importPoints = (raw: unknown): boolean => {
        if (!Array.isArray(raw) || raw.length < 2) return false;
        const valid = raw.every(
            (entry): entry is ImportedPoint =>
                typeof entry === 'object' &&
                entry !== null &&
                typeof (entry as ImportedPoint).address === 'string' &&
                (entry as ImportedPoint).address.trim().length > 0 &&
                Number.isFinite((entry as ImportedPoint).lat) &&
                Number.isFinite((entry as ImportedPoint).lng)
        );
        if (!valid) return false;

        points.value = (raw as ImportedPoint[]).map((entry) => ({
            id: nextPointId(),
            address: entry.address.trim(),
            coords: [entry.lat, entry.lng],
            name: entry.name?.trim() ?? '',
            type:
                entry.type && POINT_TYPES.includes(entry.type)
                    ? entry.type
                    : null,
            radius: Math.min(
                ROUTE_POINT_RADIUS.max,
                Math.max(
                    ROUTE_POINT_RADIUS.min,
                    entry.radius ?? ROUTE_POINT_RADIUS.default
                )
            ),
            directPath: entry.directPath === true,
            timeToPoint: durationToDate(entry.timeToPoint)
        }));
        pickingPointId.value = null;
        return true;
    };

    /** Maps a form point to its domain shape */
    const toRoutePoint = (
        point: RoutePointFormState,
        index: number
    ): RoutePoint => {
        const kind = pointKind(index);
        return {
            id: point.id,
            kind,
            address: point.address.trim(),
            coords: point.coords ? [...point.coords] : null,
            name: point.name.trim(),
            type: kind === 'intermediate' ? point.type : null,
            radius: point.radius,
            directPath: kind === 'start' ? false : point.directPath,
            timeToPoint:
                kind === 'start' ? null : dateToDuration(point.timeToPoint)
        };
    };

    /** Entered fares narrowed to the current forward pairs of the matrix */
    const collectSegmentPrices = (): Record<string, number> => {
        const prices: Record<string, number> = {};
        for (const group of tariffGroups.value) {
            for (const target of group.targets) {
                const price = segmentPrices[target.key];
                if (typeof price === 'number') prices[target.key] = price;
            }
        }
        return prices;
    };

    /**
     * Validates and submits the form; tariff fields not reachable through the
     * current toggles are pruned from the payload.
     * @returns The created route, or null when validation fails
     */
    const submit = async (): Promise<Route | null> => {
        const { valid } = await r$.$validate();
        if (!valid || !pointsComplete.value) return null;

        const intercity = state.passenger && state.intercity;
        return createRoute({
            companies: [...state.companies],
            name: state.name.trim(),
            status: state.active ? 'active' : 'inactive',
            scheduled: state.scheduled,
            startAt:
                state.scheduled && state.startAt
                    ? state.startAt.toISOString()
                    : null,
            errorCount: state.errorCount,
            passenger: state.passenger,
            intercity,
            reverseCalculation: state.passenger && state.reverseCalculation,
            singlePrice:
                state.passenger && !state.intercity ? state.singlePrice : null,
            segmentPrices: intercity ? collectSegmentPrices() : {},
            points: points.value.map(toRoutePoint),
            vehicleIds: [...state.vehicleIds],
            driverIds: [],
            groupIds: [...state.groupIds]
        });
    };

    return {
        state,
        points,
        segmentPrices,
        pickingPointId,
        r$,
        pointKind,
        addIntermediate,
        removePoint,
        requestPick,
        cancelPick,
        applyPick,
        segmentDistanceKm,
        tariffPoints,
        tariffGroups,
        pointsComplete,
        canSubmit,
        firstInvalidTab,
        importPoints,
        submit
    };
};

/** Shape shared between the route create page (provider) and its children */
export type UseRouteFormReturn = ReturnType<typeof useRouteForm>;

/** Injection key for the route form context */
export const ROUTE_FORM_KEY: InjectionKey<UseRouteFormReturn> =
    Symbol('routeForm');

/**
 * Injects the route form context provided by the route create page.
 * @returns {UseRouteFormReturn} The shared form state, validation and helpers.
 */
export const useRouteFormContext = (): UseRouteFormReturn => {
    const ctx = inject(ROUTE_FORM_KEY);
    if (!ctx) {
        throw new Error(
            'useRouteFormContext must be used within the route form page'
        );
    }
    return ctx;
};
