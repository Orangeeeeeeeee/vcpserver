import { useRegle } from '@regle/core';
import { withMessage, required, requiredIf } from '@regle/rules';
import type {
    Route,
    RoutePointKind,
    RoutePointType,
    RouteStatus
} from '~/types/route';
import type {
    RouteTariffGroup,
    RouteTariffPoint
} from '~/composables/useRouteForm';

/** Tab keys of the route edit dialog */
export type RouteEditTabKey = 'general' | 'points' | 'price';

/** One editable row of the «Точки маршруту» tab of the edit dialog */
export interface RouteEditPointState {
    id: string;
    kind: RoutePointKind;
    /** Intermediate points only; drives the «Контрольна точка»/«Зупинка» label */
    type: RoutePointType | null;
    /** Editable display name, hydrated from the point name or its address */
    name: string;
    /** Travel time from the previous point; a time-only Date for DatePicker */
    timeToPoint: Date | null;
}

/** Scalar fields of the «Основне» tab of the edit dialog */
export interface RouteEditState {
    name: string;
    status: RouteStatus;
    vehicleIds: string[];
    groupIds: string[];
}

/** Full form state of the edit dialog, covering all three tabs */
export interface RouteEditFormState extends RouteEditState {
    /** Ordered editable points of the route being edited */
    points: RouteEditPointState[];
    /** Per-city fares keyed "{fromPointId}-{toPointId}" (working copy) */
    segmentPrices: Record<string, number | null>;
}

/** `required` rule carrying the shared i18n message, reused across fields */
const requiredRule = withMessage(required, 'validation.required');

/**
 * State, validation and payload mapping of the route edit dialog. Only the
 * fields present in the dialog are editable — point geometry, radii and the
 * passenger toggles of the edited route stay untouched. Every input of the
 * dialog is required: the route name, each point name and travel time, and
 * every fare of the current forward-pair tariff matrix.
 *
 * Note: the return type is intentionally inferred (see
 * {@link UseRouteEditFormReturn}) so the regle `r$` type flows through.
 * @returns {UseRouteEditFormReturn} Shared edit-form state and helpers
 */
export const useRouteEditForm = () => {
    const state = reactive<RouteEditFormState>({
        name: '',
        status: 'active',
        vehicleIds: [],
        groupIds: [],
        points: [],
        segmentPrices: {}
    });

    /** Ordered editable points of the route being edited */
    const points = toRef(state, 'points');

    /** Per-city fares keyed "{fromPointId}-{toPointId}" (working copy) */
    const segmentPrices = toRef(state, 'segmentPrices');

    /** Points of the tariff matrix (every point has a hydrated label) */
    const tariffPoints = computed<RouteTariffPoint[]>(() =>
        points.value
            .filter((point) => point.name.trim().length > 0)
            .map((point) => ({ id: point.id, label: point.name.trim() }))
    );

    /**
     * Tariff matrix as accordion groups: every labelled point except the last
     * gets a section with fares to each of its forward points.
     */
    const tariffGroups = computed<RouteTariffGroup[]>(() =>
        tariffPoints.value.slice(0, -1).map((from, index) => ({
            from,
            targets: tariffPoints.value.slice(index + 1).map((to) => ({
                key: `${from.id}-${to.id}`,
                to
            }))
        }))
    );

    const { r$ } = useRegle(
        state,
        () => ({
            name: { required: requiredRule },
            points: {
                $each: (point: Ref<RouteEditPointState>) => ({
                    name: { required: requiredRule },
                    // The start point has no travel-time input
                    timeToPoint: {
                        required: withMessage(
                            requiredIf(() => point.value.kind !== 'start'),
                            'validation.required'
                        )
                    }
                })
            },
            segmentPrices: Object.fromEntries(
                tariffGroups.value.flatMap((group) =>
                    group.targets.map(
                        (target) =>
                            [target.key, { required: requiredRule }] as const
                    )
                )
            )
        }),
        { lazy: true }
    );

    /** Fills the form from the route being edited and resets validation */
    const hydrate = (route: Route): void => {
        state.name = route.name;
        state.status = route.status;
        state.vehicleIds = [...route.vehicleIds];
        state.groupIds = [...route.groupIds];
        state.points = route.points.map((point) => ({
            id: point.id,
            kind: point.kind,
            type: point.type,
            name: point.name.trim() || point.address,
            timeToPoint: durationToDate(point.timeToPoint)
        }));
        // Seed every forward pair of the matrix so each fare input is tracked
        state.segmentPrices = Object.fromEntries(
            tariffGroups.value.flatMap((group) =>
                group.targets.map(
                    (target) =>
                        [
                            target.key,
                            route.segmentPrices[target.key] ?? null
                        ] as const
                )
            )
        );
        r$.$reset();
    };

    /** Entered fares narrowed to the current forward pairs of the matrix */
    const collectSegmentPrices = (): Record<string, number> => {
        const prices: Record<string, number> = {};
        for (const group of tariffGroups.value) {
            for (const target of group.targets) {
                const price = segmentPrices.value[target.key];
                if (typeof price === 'number') prices[target.key] = price;
            }
        }
        return prices;
    };

    /** Tab holding the first invalid field, for the jump on failed submit */
    const firstInvalidTab = (): RouteEditTabKey => {
        if (r$.$fields.name.$invalid) return 'general';
        if (r$.$fields.points.$invalid) return 'points';
        return 'price';
    };

    /**
     * Merges the edited fields onto the original route.
     * @param base - Route the dialog was opened with.
     * @returns {Route} Updated route ready for `updateRoute`.
     */
    const buildPayload = (base: Route): Route => {
        const editedById = new Map(
            points.value.map((point) => [point.id, point])
        );
        return {
            ...base,
            name: state.name.trim(),
            status: state.status,
            vehicleIds: [...state.vehicleIds],
            groupIds: [...state.groupIds],
            points: base.points.map((point) => {
                const edited = editedById.get(point.id);
                if (!edited) return point;
                return {
                    ...point,
                    name: edited.name.trim(),
                    timeToPoint:
                        point.kind === 'start'
                            ? null
                            : dateToDuration(edited.timeToPoint)
                };
            }),
            segmentPrices: collectSegmentPrices()
        };
    };

    return {
        state,
        points,
        segmentPrices,
        tariffGroups,
        r$,
        hydrate,
        firstInvalidTab,
        buildPayload
    };
};

/** Shape shared between the edit dialog (provider) and its tab components */
export type UseRouteEditFormReturn = ReturnType<typeof useRouteEditForm>;

/** Injection key for the route edit form context */
export const ROUTE_EDIT_FORM_KEY: InjectionKey<UseRouteEditFormReturn> =
    Symbol('routeEditForm');

/**
 * Injects the route edit form context provided by the edit dialog.
 * @returns {UseRouteEditFormReturn} The shared edit-form state and helpers.
 */
export const useRouteEditFormContext = (): UseRouteEditFormReturn => {
    const ctx = inject(ROUTE_EDIT_FORM_KEY);
    if (!ctx) {
        throw new Error(
            'useRouteEditFormContext must be used within the route edit dialog'
        );
    }
    return ctx;
};
