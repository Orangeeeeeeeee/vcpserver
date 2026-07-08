import type { OnlineVehicle, OnlineVehicleDetail } from '~/types/online';
import type {
    OnlineMapLayer,
    OnlineMapOverlays
} from '~/composables/useOnlineFleet';
import {
    ONLINE_GROUPS,
    generateOnlineVehicles,
    generateOnlineVehicleDetail
} from '~/mocks/online';

/** Id of the vehicle map wrapper element (fullscreen target of the video dock) */
export const VEHICLE_MAP_WRAPPER_ID = 'vehicle-online-map-wrapper';

export interface UseOnlineVehicleFromRouteReturn {
    /** Shared online fleet state (same key the online list page uses) */
    fleet: Ref<OnlineVehicle[]>;
    /** Vehicle resolved from the route id, narrowed by the 404 guard */
    vehicle: ComputedRef<OnlineVehicle>;
}

/**
 * Resolves the viewed vehicle from the `[id]` route param against the shared
 * online fleet state. Throws a fatal 404 when the id is unknown, so both
 * vehicle detail tabs share the same guard.
 * @returns {UseOnlineVehicleFromRouteReturn} Fleet state and the vehicle.
 */
export const useOnlineVehicleFromRoute =
    (): UseOnlineVehicleFromRouteReturn => {
        const { t } = useI18n();
        const route = useRoute();

        const fleet = useState<OnlineVehicle[]>('onlineVehicles', () =>
            generateOnlineVehicles()
        );

        const vehicleRef = computed<OnlineVehicle | undefined>(() =>
            fleet.value.find((v) => v.id === (route.params.id as string))
        );

        if (!vehicleRef.value) {
            throw createError({
                statusCode: 404,
                statusMessage: t('objects.vehicles.detail.notFound'),
                fatal: true
            });
        }

        const vehicle = computed<OnlineVehicle>(
            () => vehicleRef.value as OnlineVehicle
        );

        return { fleet, vehicle };
    };

/**
 * Shared state of the vehicle detail page («Онлайн» tab): the viewed vehicle,
 * its mock detail sections, the video dock state and the map settings.
 * Created once in the page and shared with the panel and the map via
 * provide/inject — mirrors `useOnlineFleet`.
 *
 * Return type is intentionally inferred so it flows through
 * `VehicleOnlineContext` without hand-typing.
 *
 * @param vehicle Vehicle being viewed (already resolved and 404-guarded).
 */
export const useVehicleOnline = (vehicle: ComputedRef<OnlineVehicle>) => {
    /** Whole fleet (same shared state as the online list) — map search */
    const fleet = useState<OnlineVehicle[]>('onlineVehicles', () =>
        generateOnlineVehicles()
    );

    /** Group name of the viewed vehicle (marker label) */
    const groupName = computed<string>(
        () =>
            ONLINE_GROUPS.find((g) => g.id === vehicle.value.groupId)?.name ??
            ''
    );

    /** Mock detail sections (day stats, telemetry, additional data, cameras) */
    const detail = computed<OnlineVehicleDetail>(() =>
        generateOnlineVehicleDetail(vehicle.value)
    );

    /** Whether the camera video dock is open (map overlays + bottom bar) */
    const videoOpen = ref<boolean>(false);

    /** Cameras whose players are shown; all enabled by default */
    const activeCameraIds = ref<string[]>(
        detail.value.cameras.map((c) => c.id)
    );

    /** Toggles a camera chip on/off */
    const toggleCamera = (id: string): void => {
        activeCameraIds.value = activeCameraIds.value.includes(id)
            ? activeCameraIds.value.filter((c) => c !== id)
            : [...activeCameraIds.value, id];
    };

    /** Active cameras in display order */
    const activeCameras = computed(() =>
        detail.value.cameras.filter((c) => activeCameraIds.value.includes(c.id))
    );

    /** «Слідкувати» toggle; the map recenters on the vehicle when enabled */
    const following = ref<boolean>(false);

    /** Map base layer + mock overlay toggles */
    const mapLayer = ref<OnlineMapLayer>('streets');
    const overlays = reactive<OnlineMapOverlays>({
        traffic: false,
        geoZones: true,
        precipitation: false,
        temperature: false,
        wind: false
    });

    return {
        vehicle,
        fleet,
        groupName,
        detail,
        videoOpen,
        activeCameraIds,
        activeCameras,
        toggleCamera,
        following,
        mapLayer,
        overlays
    };
};

/** Shape shared between the vehicle page (provider) and panel/map (consumers) */
export type VehicleOnlineContext = ReturnType<typeof useVehicleOnline>;

/** Injection key for the vehicle online context */
export const VEHICLE_ONLINE_KEY: InjectionKey<VehicleOnlineContext> =
    Symbol('vehicleOnline');

/**
 * Injects the vehicle online context provided by the vehicle detail page.
 * @returns {VehicleOnlineContext} Shared vehicle, detail data and map state.
 */
export const useVehicleOnlineContext = (): VehicleOnlineContext => {
    const ctx = inject(VEHICLE_ONLINE_KEY);
    if (!ctx) {
        throw new Error(
            'useVehicleOnlineContext must be used within the vehicle detail page'
        );
    }
    return ctx;
};
