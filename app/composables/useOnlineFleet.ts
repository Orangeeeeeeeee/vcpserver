import type { OnlineGroup, OnlineVehicle } from '~/types/online';
import { MOVING_STATUSES, STANDING_STATUSES } from '~/constants/online';
import { ONLINE_GROUPS, generateOnlineVehicles } from '~/mocks/online';

/** Quick status filter values (the «Статус» chip row in the filter popover) */
export type OnlineQuickFilter = 'all' | 'moving' | 'standing' | 'engineOff';

/** Per-group panel UI state */
export interface OnlineGroupState {
    /** Whether the group's markers are shown on the map */
    visible: boolean;
    /** Whether the group's vehicle list is expanded in the panel */
    expanded: boolean;
}

/** An active-filter chip shown under the search row */
export interface OnlineFilterChip {
    /** Stable key used to remove the chip */
    key: string;
    /** Already-translated label */
    label: string;
}

/** Map base layer */
export type OnlineMapLayer = 'streets' | 'satellite';

/** Mock overlay toggles of the map layers popover */
export interface OnlineMapOverlays {
    traffic: boolean;
    geoZones: boolean;
    precipitation: boolean;
    temperature: boolean;
    wind: boolean;
}

/**
 * Shared state of the Online page: fleet data, search, status quick-filters,
 * mock filter sections, per-group visibility and the map layer settings.
 * Created once in the online page and shared with the panel and the map via
 * provide/inject — mirrors `useDriverFilters`.
 *
 * Return type is intentionally inferred so it flows through
 * `OnlineFleetContext` without hand-typing.
 */
export const useOnlineFleet = () => {
    const { t } = useI18n();

    const groups: OnlineGroup[] = ONLINE_GROUPS;
    const vehicles = useState<OnlineVehicle[]>('onlineVehicles', () =>
        generateOnlineVehicles()
    );

    const searchQuery = ref('');

    /** Selected quick status filters; «all» resets the rest */
    const statusFilters = ref<OnlineQuickFilter[]>(['all']);

    /** Mock filter sections (visual only — they do not narrow the fleet) */
    const checkboxChoices = ref<string[]>(['5']);
    const radioChoice = ref<string | null>('2');
    const toggleA = ref<boolean>(false);
    const toggleB = ref<boolean>(true);

    /** Per-group visibility/expansion (first group expanded, per the mockup) */
    const groupState = reactive<Record<string, OnlineGroupState>>(
        Object.fromEntries(
            groups.map((g, i) => [g.id, { visible: true, expanded: i === 0 }])
        )
    );

    /** Toggles a quick status filter, keeping «all» mutually exclusive */
    const toggleStatusFilter = (value: OnlineQuickFilter): void => {
        if (value === 'all') {
            statusFilters.value = ['all'];
            return;
        }
        const next = statusFilters.value.filter(
            (v) => v !== 'all' && v !== value
        );
        if (!statusFilters.value.includes(value)) next.push(value);
        statusFilters.value = next.length ? next : ['all'];
    };

    /** True when the vehicle passes the quick status filters */
    const matchesStatus = (vehicle: OnlineVehicle): boolean => {
        if (statusFilters.value.includes('all')) return true;
        return statusFilters.value.some((f) => {
            if (f === 'moving') return MOVING_STATUSES.includes(vehicle.status);
            if (f === 'standing')
                return STANDING_STATUSES.includes(vehicle.status);
            return vehicle.status === 'stopped';
        });
    };

    /** True when the vehicle matches the search query (name or id) */
    const matchesSearch = (vehicle: OnlineVehicle): boolean => {
        const q = searchQuery.value.trim().toLowerCase();
        if (!q) return true;
        return (
            vehicle.name.toLowerCase().includes(q) ||
            vehicle.vehicleId.toLowerCase().includes(q)
        );
    };

    /** Vehicles per group after search + status filters (panel lists) */
    const vehiclesByGroup = computed<Record<string, OnlineVehicle[]>>(() => {
        const map: Record<string, OnlineVehicle[]> = {};
        for (const group of groups) map[group.id] = [];
        for (const vehicle of vehicles.value) {
            if (!matchesStatus(vehicle) || !matchesSearch(vehicle)) continue;
            map[vehicle.groupId]?.push(vehicle);
        }
        return map;
    });

    /** Total vehicles per group (the header count badge) */
    const groupCounts = computed<Record<string, number>>(() => {
        const map: Record<string, number> = {};
        for (const vehicle of vehicles.value) {
            map[vehicle.groupId] = (map[vehicle.groupId] ?? 0) + 1;
        }
        return map;
    });

    /** Filtered vehicles of map-visible groups (drives the markers) */
    const visibleVehicles = computed<OnlineVehicle[]>(() =>
        groups.flatMap((g) =>
            groupState[g.id]?.visible ? (vehiclesByGroup.value[g.id] ?? []) : []
        )
    );

    /** Active filter chips (status + mock sections), removable */
    const filterChips = computed<OnlineFilterChip[]>(() => {
        const chips: OnlineFilterChip[] = statusFilters.value.map((f) => ({
            key: `status:${f}`,
            label: t(`objects.online.filters.quick.${f}`)
        }));
        for (const v of checkboxChoices.value) {
            chips.push({
                key: `check:${v}`,
                label: t('objects.online.filters.option', { n: v })
            });
        }
        if (radioChoice.value) {
            chips.push({
                key: 'radio',
                label: t('objects.online.filters.option', {
                    n: radioChoice.value
                })
            });
        }
        if (toggleA.value) {
            chips.push({
                key: 'toggleA',
                label: t('objects.online.filters.filterName')
            });
        }
        if (toggleB.value) {
            chips.push({
                key: 'toggleB',
                label: t('objects.online.filters.filterName')
            });
        }
        return chips;
    });

    /** Removes the selection behind a filter chip */
    const removeChip = (key: string): void => {
        if (key.startsWith('status:')) {
            const value = key.slice(7) as OnlineQuickFilter;
            statusFilters.value = statusFilters.value.filter(
                (v) => v !== value
            );
            if (!statusFilters.value.length) statusFilters.value = ['all'];
            return;
        }
        if (key.startsWith('check:')) {
            const value = key.slice(6);
            checkboxChoices.value = checkboxChoices.value.filter(
                (v) => v !== value
            );
            return;
        }
        if (key === 'radio') radioChoice.value = null;
        if (key === 'toggleA') toggleA.value = false;
        if (key === 'toggleB') toggleB.value = false;
    };

    /**
     * Pending «fly the map to this vehicle» request (panel card / marker
     * click). Wrapped in a fresh object per request so repeat clicks on the
     * same vehicle still trigger the map watcher.
     */
    const focusRequest = shallowRef<{ vehicle: OnlineVehicle } | null>(null);

    /** Asks the map to fly to the vehicle and pulse its marker */
    const requestFocus = (vehicle: OnlineVehicle): void => {
        focusRequest.value = { vehicle };
    };

    /** Map base layer + mock overlay toggles (geo-zones on, per the mockup) */
    const mapLayer = ref<OnlineMapLayer>('streets');
    const overlays = reactive<OnlineMapOverlays>({
        traffic: false,
        geoZones: true,
        precipitation: false,
        temperature: false,
        wind: false
    });

    return {
        groups,
        groupState,
        groupCounts,
        vehiclesByGroup,
        visibleVehicles,
        searchQuery,
        statusFilters,
        toggleStatusFilter,
        checkboxChoices,
        radioChoice,
        toggleA,
        toggleB,
        filterChips,
        removeChip,
        focusRequest,
        requestFocus,
        mapLayer,
        overlays
    };
};

/** Shape shared between the online page (provider) and panel/map (consumers) */
export type OnlineFleetContext = ReturnType<typeof useOnlineFleet>;

/** Injection key for the online fleet context */
export const ONLINE_FLEET_KEY: InjectionKey<OnlineFleetContext> =
    Symbol('onlineFleet');

/**
 * Injects the online fleet context provided by the online page.
 * @returns {OnlineFleetContext} Shared fleet state, filters and map settings.
 */
export const useOnlineFleetContext = (): OnlineFleetContext => {
    const ctx = inject(ONLINE_FLEET_KEY);
    if (!ctx) {
        throw new Error(
            'useOnlineFleetContext must be used within the online page'
        );
    }
    return ctx;
};
