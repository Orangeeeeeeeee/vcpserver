import type { Zone } from '~/types/zone';
import type { ZoneStats } from '~/types/zone-stats';
import { generateZoneStats } from '~/mocks/zone-stats';
import { formatUaDate } from '~/utils/date';

/**
 * State of the zone detail page: the viewed zone, the selected statistics
 * date and the (mock) statistics for that day. Created once in the zone
 * detail page and shared with the panel and the map via provide/inject.
 *
 * Return type is intentionally inferred (see {@link ZoneDetailContext}).
 * @param {Zone} zone Zone being viewed.
 */
export const useZoneStats = (zone: Zone) => {
    const { vehicles } = useVehicles();

    /** Statistics day; defaults to today */
    const selectedDate = ref<Date>(new Date());

    /** Mock statistics of the selected day (deterministic per zone+date) */
    const stats = computed<ZoneStats>(() =>
        generateZoneStats({
            zone,
            date: formatUaDate(selectedDate.value),
            vehicleIds: vehicles.value.map((v) => v.id)
        })
    );

    return { zone, selectedDate, stats };
};

/** Shape shared between the zone detail page (provider) and its children */
export type ZoneDetailContext = ReturnType<typeof useZoneStats>;

/** Injection key for the zone detail context */
export const ZONE_DETAIL_KEY: InjectionKey<ZoneDetailContext> =
    Symbol('zoneDetail');

/**
 * Injects the zone detail context provided by the zone detail page.
 * @returns {ZoneDetailContext} The viewed zone, selected date and statistics.
 */
export const useZoneDetailContext = (): ZoneDetailContext => {
    const ctx = inject(ZONE_DETAIL_KEY);
    if (!ctx) {
        throw new Error(
            'useZoneDetailContext must be used within the zone detail page'
        );
    }
    return ctx;
};
