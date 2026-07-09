import { ROUTE_STATUSES, ROUTE_STATUS_META } from '~/constants/route-list';
import { mockCompanies } from '~/mocks/companies';
import type { Route, RouteStatus } from '~/types/route';

/** Reactive filter state for the route lists (live filtering, no Apply) */
export interface RouteFilterState {
    company: string | null;
    statuses: RouteStatus[];
    groupIds: string[];
    driverIds: string[];
    vehicleIds: string[];
}

/** Option of the filter selects */
export interface RouteFilterOption<T extends string = string> {
    label: string;
    value: T;
}

/** One removable chip of the active-filters row next to the filter button */
export interface RouteFilterChip {
    /** Unique key of the chip (filter kind + value) */
    key: string;
    label: string;
    /** Removes this value from its filter */
    remove: () => void;
}

/**
 * Reactive state, option lists and the `matches` predicate for the routes
 * filter popover. Created once per route list and shared with the popover
 * via provide/inject — mirrors `useDriverFilters`.
 *
 * Return type is intentionally inferred so it flows through
 * `RouteFiltersContext` without hand-typing.
 */
export const useRouteFilters = () => {
    const { t } = useI18n();
    const { groups } = useGroups();
    const { drivers } = useDrivers();
    const { vehicles } = useVehicles();

    const emptyState = (): RouteFilterState => ({
        company: null,
        statuses: [],
        groupIds: [],
        driverIds: [],
        vehicleIds: []
    });

    const state = reactive<RouteFilterState>(emptyState());

    /** Company select options (plain strings) */
    const companies = mockCompanies;

    /** Status options: RouteStatus value + localized label */
    const statusOptions = computed<RouteFilterOption<RouteStatus>[]>(() =>
        ROUTE_STATUSES.map((status) => ({
            value: status,
            label: t(ROUTE_STATUS_META[status].labelKey)
        }))
    );

    /** Group multiselect options (label: group name, value: group id) */
    const groupOptions = computed<RouteFilterOption[]>(() =>
        groups.value.map((group) => ({ label: group.name, value: group.id }))
    );

    /** Driver multiselect options (label: driver name, value: driver id) */
    const driverOptions = computed<RouteFilterOption[]>(() =>
        drivers.value.map((driver) => ({
            label: driver.name,
            value: driver.id
        }))
    );

    /** Vehicle multiselect options, labelled like «MAN TGX 18.480 (ID: TRK-112)» */
    const vehicleOptions = computed<RouteFilterOption[]>(() =>
        vehicles.value.map((vehicle) => ({
            label: `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`,
            value: vehicle.id
        }))
    );

    /** True when the two id lists share at least one entry */
    const overlaps = (selected: string[], assigned: string[]): boolean =>
        selected.some((id) => assigned.includes(id));

    /**
     * True when a route passes every ACTIVE filter (a filter is ignored when
     * its selection is empty/null). AND across filters, OR within a multiselect.
     */
    const matches = (route: Route): boolean => {
        if (state.company && !route.companies.includes(state.company)) {
            return false;
        }
        if (state.statuses.length && !state.statuses.includes(route.status)) {
            return false;
        }
        if (
            state.groupIds.length &&
            !overlaps(state.groupIds, route.groupIds)
        ) {
            return false;
        }
        if (
            state.driverIds.length &&
            !overlaps(state.driverIds, route.driverIds)
        ) {
            return false;
        }
        if (
            state.vehicleIds.length &&
            !overlaps(state.vehicleIds, route.vehicleIds)
        ) {
            return false;
        }
        return true;
    };

    /** Number of active filters (for the button badge) */
    const activeCount = computed<number>(() => {
        let count = 0;
        if (state.company) count++;
        if (state.statuses.length) count++;
        if (state.groupIds.length) count++;
        if (state.driverIds.length) count++;
        if (state.vehicleIds.length) count++;
        return count;
    });

    /** Chips of every selected filter value, shown next to the button */
    const activeChips = computed<RouteFilterChip[]>(() => {
        const chips: RouteFilterChip[] = [];
        if (state.company) {
            chips.push({
                key: `company-${state.company}`,
                label: state.company,
                remove: () => (state.company = null)
            });
        }
        const pull = <T extends string>(list: T[], value: T): void => {
            const index = list.indexOf(value);
            if (index !== -1) list.splice(index, 1);
        };
        for (const status of state.statuses) {
            chips.push({
                key: `status-${status}`,
                label: t(ROUTE_STATUS_META[status].labelKey),
                remove: () => pull(state.statuses, status)
            });
        }
        const byValue = (options: RouteFilterOption[], value: string): string =>
            options.find((option) => option.value === value)?.label ?? value;
        for (const id of state.groupIds) {
            chips.push({
                key: `group-${id}`,
                label: byValue(groupOptions.value, id),
                remove: () => pull(state.groupIds, id)
            });
        }
        for (const id of state.driverIds) {
            chips.push({
                key: `driver-${id}`,
                label: byValue(driverOptions.value, id),
                remove: () => pull(state.driverIds, id)
            });
        }
        for (const id of state.vehicleIds) {
            chips.push({
                key: `vehicle-${id}`,
                label: byValue(vehicleOptions.value, id),
                remove: () => pull(state.vehicleIds, id)
            });
        }
        return chips;
    });

    /** Clears all filters back to the empty state */
    const reset = (): void => {
        Object.assign(state, emptyState());
    };

    return {
        state,
        companies,
        statusOptions,
        groupOptions,
        driverOptions,
        vehicleOptions,
        matches,
        activeCount,
        activeChips,
        reset
    };
};

/** Shape shared between a route list (provider) and the popover (consumer) */
export type RouteFiltersContext = ReturnType<typeof useRouteFilters>;

/** Injection key for the route filters context */
export const ROUTE_FILTERS_KEY: InjectionKey<RouteFiltersContext> =
    Symbol('routeFilters');

/**
 * Injects the route filters context provided by the route list.
 * @returns {RouteFiltersContext} Shared filter state, options and helpers.
 */
export const useRouteFiltersContext = (): RouteFiltersContext => {
    const ctx = inject(ROUTE_FILTERS_KEY);
    if (!ctx) {
        throw new Error(
            'useRouteFiltersContext must be used within a route list'
        );
    }
    return ctx;
};
