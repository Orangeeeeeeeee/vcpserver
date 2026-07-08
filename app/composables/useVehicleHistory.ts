import type { OnlineVehicle, VehicleCamera } from '~/types/online';
import type { HistoryPeriod, VehicleHistory } from '~/types/history';
import type {
    OnlineMapLayer,
    OnlineMapOverlays
} from '~/composables/useOnlineFleet';
import { generateVehicleHistory } from '~/mocks/history';
import { generateOnlineVehicleDetail } from '~/mocks/online';

/** Id of the history map wrapper element (fullscreen target of the video dock) */
export const HISTORY_MAP_WRAPPER_ID = 'vehicle-history-map-wrapper';

/** Playback speed multipliers offered by the telemetry panel */
export const PLAYBACK_SPEEDS = [1, 3, 5, 10] as const;

/** Cursor advance per playback tick at 1x (ticks run every 100 ms) */
const PLAYBACK_STEP = 0.0012;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Formats a date as a short timeline label, e.g. "12 жовт. 14:46" */
const shortLabel = (date: Date, withTime: boolean): string => {
    const day = new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'short'
    }).format(date);
    if (!withTime) return day;
    const time = new Intl.DateTimeFormat('uk-UA', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
    return `${day} ${time}`;
};

/** Info shown in the playback row for the current cursor position */
export interface HistoryCursorInfo {
    /** "dd.mm.yyyy" of the cursor position */
    dateLabel: string;
    /** "HH:MM" of the cursor position */
    timeLabel: string;
    /** Address under the cursor */
    address: string;
    /** Speed value under the cursor, km/h */
    speed: number;
}

/**
 * Shared state of the vehicle history tab: the viewed vehicle, the date
 * filter, mock history data, the timeline cursor with live playback, and the
 * video/telemetry panel toggles. Created once in the history page and shared
 * with the panel and the map via provide/inject — mirrors `useVehicleOnline`.
 *
 * Return type is intentionally inferred so it flows through
 * `VehicleHistoryContext` without hand-typing.
 *
 * @param vehicle Vehicle being viewed (already resolved and 404-guarded).
 */
export const useVehicleHistory = (vehicle: ComputedRef<OnlineVehicle>) => {
    /** Whole fleet (same shared state as the online list) — map search */
    const fleet = useState<OnlineVehicle[]>('onlineVehicles');

    /** Date filter */
    const selectedPeriod = ref<HistoryPeriod>('today');
    const customDate = ref<Date | null>(null);

    /** Seed distinguishing periods, so each one shows different mock data */
    const periodSeed = computed<number>(() => {
        switch (selectedPeriod.value) {
            case 'today':
                return 1;
            case 'yesterday':
                return 2;
            case 'dayBefore':
                return 3;
            case 'last7days':
                return 4;
            case 'custom':
                return customDate.value
                    ? 5 + (customDate.value.getDate() % 27)
                    : 5;
        }
    });

    /** Mock history for the vehicle and the selected period */
    const history = computed<VehicleHistory>(() =>
        generateVehicleHistory(vehicle.value, periodSeed.value)
    );

    /** Start/end instants of the selected period (drives cursor labels) */
    const periodRange = computed<{ start: Date; end: Date }>(() => {
        const dayStart = (d: Date): Date =>
            new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const now = new Date();
        switch (selectedPeriod.value) {
            case 'today':
                return { start: dayStart(now), end: now };
            case 'yesterday': {
                const start = new Date(dayStart(now).getTime() - DAY_MS);
                return { start, end: new Date(dayStart(now).getTime() - 1) };
            }
            case 'dayBefore': {
                const start = new Date(dayStart(now).getTime() - 2 * DAY_MS);
                return { start, end: new Date(start.getTime() + DAY_MS - 1) };
            }
            case 'last7days':
                return {
                    start: new Date(dayStart(now).getTime() - 6 * DAY_MS),
                    end: now
                };
            case 'custom': {
                const start = customDate.value ?? dayStart(now);
                return { start, end: new Date(start.getTime() + DAY_MS - 1) };
            }
        }
    });

    /** Start / middle / end labels under the timeline track */
    const rangeLabels = computed<[string, string, string]>(() => {
        const { start, end } = periodRange.value;
        const mid = new Date((start.getTime() + end.getTime()) / 2);
        return [
            shortLabel(start, true),
            shortLabel(mid, false),
            shortLabel(end, true)
        ];
    });

    /** Timeline cursor as a 0..1 fraction of the period */
    const cursor = ref<number>(0.35);

    /** Playback state (the cursor moves while playing) */
    const playing = ref<boolean>(false);
    const playSpeed = ref<number>(1);

    let playTimer: ReturnType<typeof setInterval> | null = null;

    const stopPlayback = (): void => {
        playing.value = false;
        if (playTimer) {
            clearInterval(playTimer);
            playTimer = null;
        }
    };

    /** Advances the cursor while playing; stops at the period end */
    watch(playing, (on) => {
        if (!on) {
            stopPlayback();
            return;
        }
        playTimer = setInterval(() => {
            const next = cursor.value + PLAYBACK_STEP * playSpeed.value;
            if (next >= 1) {
                cursor.value = 1;
                stopPlayback();
                return;
            }
            cursor.value = next;
        }, 100);
    });

    onUnmounted(stopPlayback);

    /** Playback readout (date/time, address, speed) at the cursor position */
    const cursorInfo = computed<HistoryCursorInfo>(() => {
        const { start, end } = periodRange.value;
        const at = new Date(
            start.getTime() + (end.getTime() - start.getTime()) * cursor.value
        );
        const speedSeries = history.value.params[0]?.values ?? [];
        const index = Math.min(
            Math.floor(cursor.value * speedSeries.length),
            speedSeries.length - 1
        );
        return {
            dateLabel: formatUaDate(at),
            timeLabel: new Intl.DateTimeFormat('uk-UA', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(at),
            address:
                history.value.addresses[
                    index % history.value.addresses.length
                ] ?? '',
            speed: Math.round(speedSeries[index] ?? 0)
        };
    });

    /** Telemetry panel */
    const telemetryOpen = ref<boolean>(false);
    const selectedParamKey = ref<string>('speed');

    /** Video dock (cameras reuse the online detail mock) */
    const cameras = computed<VehicleCamera[]>(
        () => generateOnlineVehicleDetail(vehicle.value).cameras
    );
    const videoOpen = ref<boolean>(false);
    const activeCameraIds = ref<string[]>(cameras.value.map((c) => c.id));

    /** Toggles a camera chip on/off */
    const toggleCamera = (id: string): void => {
        activeCameraIds.value = activeCameraIds.value.includes(id)
            ? activeCameraIds.value.filter((c) => c !== id)
            : [...activeCameraIds.value, id];
    };

    /** Active cameras in display order */
    const activeCameras = computed<VehicleCamera[]>(() =>
        cameras.value.filter((c) => activeCameraIds.value.includes(c.id))
    );

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
        selectedPeriod,
        customDate,
        history,
        periodRange,
        rangeLabels,
        cursor,
        playing,
        playSpeed,
        cursorInfo,
        telemetryOpen,
        selectedParamKey,
        cameras,
        videoOpen,
        activeCameraIds,
        toggleCamera,
        activeCameras,
        mapLayer,
        overlays
    };
};

/** Shape shared between the history page (provider) and panel/map (consumers) */
export type VehicleHistoryContext = ReturnType<typeof useVehicleHistory>;

/** Injection key for the vehicle history context */
export const VEHICLE_HISTORY_KEY: InjectionKey<VehicleHistoryContext> =
    Symbol('vehicleHistory');

/**
 * Injects the vehicle history context provided by the history page.
 * @returns {VehicleHistoryContext} Shared history state and map settings.
 */
export const useVehicleHistoryContext = (): VehicleHistoryContext => {
    const ctx = inject(VEHICLE_HISTORY_KEY);
    if (!ctx) {
        throw new Error(
            'useVehicleHistoryContext must be used within the history page'
        );
    }
    return ctx;
};
