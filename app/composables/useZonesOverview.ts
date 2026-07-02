import type { Zone, ZoneShape, ZoneType } from '~/types/zone';
import { ZONE_SHAPE_OPTIONS, ZONE_TYPE_OPTIONS } from '~/constants/zones';

/** Multiselect values of the zones filter popover */
export interface ZonesOverviewFilters {
    companies: string[];
    shapes: ZoneShape[];
    types: ZoneType[];
    groupIds: string[];
    vehicleIds: string[];
}

/** An active-filter chip shown under the search row */
export interface ZonesFilterChip {
    /** Stable key used to remove the chip, e.g. "shape:circle" */
    key: string;
    /** Already-translated label */
    label: string;
}

/** Map base layer of the zones overview map */
export type ZonesMapLayer = 'streets' | 'satellite';

/** Builds empty filter selections */
const emptyFilters = (): ZonesOverviewFilters => ({
    companies: [],
    shapes: [],
    types: [],
    groupIds: [],
    vehicleIds: []
});

/**
 * Shared state of the zones overview page: search, filters, the filtered
 * zone list and the selected zone. Created once in the zones list page and
 * shared with the panel and the map via provide/inject — mirrors
 * `useOnlineFleet`.
 *
 * Return type is intentionally inferred so it flows through
 * `ZonesOverviewContext` without hand-typing.
 */
export const useZonesOverview = () => {
    const { t } = useI18n();
    const { zones } = useZones();
    const { groups } = useGroups();
    const { vehicles } = useVehicles();

    const searchQuery = ref<string>('');

    /** Multiselect values of the filter popover */
    const filters = reactive<ZonesOverviewFilters>(emptyFilters());

    /**
     * Zone selected from a card or a map shape; drives the map focus and
     * the card highlight/expansion.
     */
    const selectedZoneId = ref<string | null>(null);

    /** True when the zone matches the search query (name or company) */
    const matchesSearch = (zone: Zone): boolean => {
        const q = searchQuery.value.trim().toLowerCase();
        if (!q) return true;
        return (
            zone.name.toLowerCase().includes(q) ||
            zone.companies.some((c) => c.toLowerCase().includes(q))
        );
    };

    /** True when the zone passes every filter field (OR inside a field) */
    const matchesFilters = (zone: Zone): boolean => {
        if (
            filters.companies.length &&
            !zone.companies.some((c) => filters.companies.includes(c))
        )
            return false;
        if (
            filters.shapes.length &&
            !filters.shapes.includes(zone.geometry.kind)
        )
            return false;
        if (
            filters.types.length &&
            !zone.types.some((tp) => filters.types.includes(tp))
        )
            return false;
        if (
            filters.groupIds.length &&
            !zone.groupBindings.some((b) =>
                b.ids.some((id) => filters.groupIds.includes(id))
            )
        )
            return false;
        if (
            filters.vehicleIds.length &&
            !zone.vehicleBindings.some((b) =>
                b.ids.some((id) => filters.vehicleIds.includes(id))
            )
        )
            return false;
        return true;
    };

    /** Zones after search + filters (drives both the list and the map) */
    const filteredZones = computed<Zone[]>(() =>
        zones.value.filter((z) => matchesSearch(z) && matchesFilters(z))
    );

    /** Group name lookup for the filter chips */
    const groupNameById = computed<Map<string, string>>(
        () => new Map(groups.value.map((g) => [g.id, g.name]))
    );

    /** Vehicle label lookup for the filter chips */
    const vehicleLabelById = computed<Map<string, string>>(
        () =>
            new Map(vehicles.value.map((v) => [v.id, `${v.brand} ${v.model}`]))
    );

    /** Active filter chips shown under the search row, removable */
    const filterChips = computed<ZonesFilterChip[]>(() => {
        const chips: ZonesFilterChip[] = [];
        for (const company of filters.companies) {
            chips.push({ key: `company:${company}`, label: company });
        }
        for (const shape of filters.shapes) {
            const option = ZONE_SHAPE_OPTIONS.find((o) => o.value === shape);
            if (option) {
                chips.push({
                    key: `shape:${shape}`,
                    label: t(option.labelKey)
                });
            }
        }
        for (const type of filters.types) {
            const option = ZONE_TYPE_OPTIONS.find((o) => o.value === type);
            if (option) {
                chips.push({ key: `type:${type}`, label: t(option.labelKey) });
            }
        }
        for (const id of filters.groupIds) {
            chips.push({
                key: `group:${id}`,
                label: groupNameById.value.get(id) ?? id
            });
        }
        for (const id of filters.vehicleIds) {
            chips.push({
                key: `vehicle:${id}`,
                label: vehicleLabelById.value.get(id) ?? id
            });
        }
        return chips;
    });

    /** Removes the selection behind a filter chip */
    const removeChip = (key: string): void => {
        const sep = key.indexOf(':');
        const field = key.slice(0, sep);
        const value = key.slice(sep + 1);
        if (field === 'company') {
            filters.companies = filters.companies.filter((v) => v !== value);
        } else if (field === 'shape') {
            filters.shapes = filters.shapes.filter((v) => v !== value);
        } else if (field === 'type') {
            filters.types = filters.types.filter((v) => v !== value);
        } else if (field === 'group') {
            filters.groupIds = filters.groupIds.filter((v) => v !== value);
        } else if (field === 'vehicle') {
            filters.vehicleIds = filters.vehicleIds.filter((v) => v !== value);
        }
    };

    /** Clears every filter selection */
    const resetFilters = (): void => {
        Object.assign(filters, emptyFilters());
    };

    /** Selects a zone (card click / map shape click); null clears it */
    const selectZone = (id: string | null): void => {
        selectedZoneId.value = id;
    };

    /** Map base layer of the overview map */
    const mapLayer = ref<ZonesMapLayer>('streets');

    return {
        zones,
        filteredZones,
        searchQuery,
        filters,
        filterChips,
        removeChip,
        resetFilters,
        selectedZoneId,
        selectZone,
        mapLayer
    };
};

/** Shape shared between the zones page (provider) and panel/map (consumers) */
export type ZonesOverviewContext = ReturnType<typeof useZonesOverview>;

/** Injection key for the zones overview context */
export const ZONES_OVERVIEW_KEY: InjectionKey<ZonesOverviewContext> =
    Symbol('zonesOverview');

/**
 * Injects the zones overview context provided by the zones list page.
 * @returns {ZonesOverviewContext} Shared zones state, filters and selection.
 */
export const useZonesOverviewContext = (): ZonesOverviewContext => {
    const ctx = inject(ZONES_OVERVIEW_KEY);
    if (!ctx) {
        throw new Error(
            'useZonesOverviewContext must be used within the zones list page'
        );
    }
    return ctx;
};
