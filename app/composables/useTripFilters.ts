import { ARCHIVE_TRIP_STATUSES, TRIP_STATUS_META } from '~/constants/trip-list';
import { mockCompanies } from '~/mocks/companies';
import type { Trip, TripStatus } from '~/types/trip';

/** Reactive filter state of the trip lists (live filtering, no Apply) */
export interface TripFilterState {
    company: string | null;
    routeIds: string[];
    /** Archive only: keeps trips started on this calendar day */
    date: Date | null;
    /** Archive only: finished/cancelled selection; empty = all */
    statuses: TripStatus[];
    vehicleIds: string[];
    driverIds: string[];
}

/** Option of the filter selects */
export interface TripFilterOption<T extends string = string> {
    label: string;
    value: T;
}

/** One removable chip of the active-filters row next to the filter button */
export interface TripFilterChip {
    /** Unique key of the chip (filter kind + value) */
    key: string;
    label: string;
    /** Removes this value from its filter */
    remove: () => void;
}

/**
 * Reactive state, option lists and the `matches` predicate for the trips
 * filter popover. Created once per trip list and shared with the popover
 * via provide/inject — mirrors `useRouteFilters`.
 *
 * Return type is intentionally inferred so it flows through
 * `TripFiltersContext` without hand-typing.
 */
export const useTripFilters = () => {
    const { t } = useI18n();
    const { routes } = useRoutes();
    const { drivers } = useDrivers();
    const { vehicles } = useVehicles();

    const emptyState = (): TripFilterState => ({
        company: null,
        routeIds: [],
        date: null,
        statuses: [],
        vehicleIds: [],
        driverIds: []
    });

    const state = reactive<TripFilterState>(emptyState());

    /** Company select options (plain strings) */
    const companies = mockCompanies;

    /** Route multiselect options (label: route name, value: route id) */
    const routeOptions = computed<TripFilterOption[]>(() =>
        routes.value.map((route) => ({ label: route.name, value: route.id }))
    );

    /** Archive status options: TripStatus value + localized label */
    const statusOptions = computed<TripFilterOption<TripStatus>[]>(() =>
        ARCHIVE_TRIP_STATUSES.map((status) => ({
            value: status,
            label: t(TRIP_STATUS_META[status].labelKey)
        }))
    );

    /** Driver multiselect options (label: driver name, value: driver id) */
    const driverOptions = computed<TripFilterOption[]>(() =>
        drivers.value.map((driver) => ({
            label: driver.name,
            value: driver.id
        }))
    );

    /** Vehicle multiselect options, labelled like «MAN TGX 18.480 (ID: TRK-112)» */
    const vehicleOptions = computed<TripFilterOption[]>(() =>
        vehicles.value.map((vehicle) => ({
            label: `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`,
            value: vehicle.id
        }))
    );

    /** True when the two id lists share at least one entry */
    const overlaps = (selected: string[], assigned: string[]): boolean =>
        selected.some((id) => assigned.includes(id));

    /** True when the two dates fall on the same calendar day */
    const isSameDay = (a: Date, b: Date): boolean =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    /**
     * True when a trip passes every ACTIVE filter (a filter is ignored when
     * its selection is empty/null). AND across filters, OR within a
     * multiselect. Company is resolved through the trip's route.
     */
    const matches = (trip: Trip): boolean => {
        if (state.company) {
            const route = routes.value.find((r) => r.id === trip.routeId);
            if (!route?.companies.includes(state.company)) return false;
        }
        if (state.routeIds.length && !state.routeIds.includes(trip.routeId)) {
            return false;
        }
        if (state.date && !isSameDay(new Date(trip.startAt), state.date)) {
            return false;
        }
        if (state.statuses.length && !state.statuses.includes(trip.status)) {
            return false;
        }
        if (
            state.vehicleIds.length &&
            !overlaps(
                state.vehicleIds,
                trip.resources.map((resource) => resource.vehicleId)
            )
        ) {
            return false;
        }
        if (
            state.driverIds.length &&
            !overlaps(
                state.driverIds,
                trip.resources.map((resource) => resource.driverId)
            )
        ) {
            return false;
        }
        return true;
    };

    /** Number of active filters (for the button badge) */
    const activeCount = computed<number>(() => {
        let count = 0;
        if (state.company) count++;
        if (state.routeIds.length) count++;
        if (state.date) count++;
        if (state.statuses.length) count++;
        if (state.vehicleIds.length) count++;
        if (state.driverIds.length) count++;
        return count;
    });

    /** Chips of every selected filter value, shown next to the button */
    const activeChips = computed<TripFilterChip[]>(() => {
        const chips: TripFilterChip[] = [];
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
        const byValue = (options: TripFilterOption[], value: string): string =>
            options.find((option) => option.value === value)?.label ?? value;
        for (const id of state.routeIds) {
            chips.push({
                key: `route-${id}`,
                label: byValue(routeOptions.value, id),
                remove: () => pull(state.routeIds, id)
            });
        }
        if (state.date) {
            chips.push({
                key: 'date',
                label: formatUaDate(state.date),
                remove: () => (state.date = null)
            });
        }
        for (const status of state.statuses) {
            chips.push({
                key: `status-${status}`,
                label: t(TRIP_STATUS_META[status].labelKey),
                remove: () => pull(state.statuses, status)
            });
        }
        for (const id of state.vehicleIds) {
            chips.push({
                key: `vehicle-${id}`,
                label: byValue(vehicleOptions.value, id),
                remove: () => pull(state.vehicleIds, id)
            });
        }
        for (const id of state.driverIds) {
            chips.push({
                key: `driver-${id}`,
                label: byValue(driverOptions.value, id),
                remove: () => pull(state.driverIds, id)
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
        routeOptions,
        statusOptions,
        driverOptions,
        vehicleOptions,
        matches,
        activeCount,
        activeChips,
        reset
    };
};

/** Shape shared between a trip list (provider) and the popover (consumer) */
export type TripFiltersContext = ReturnType<typeof useTripFilters>;

/** Injection key for the trip filters context */
export const TRIP_FILTERS_KEY: InjectionKey<TripFiltersContext> =
    Symbol('tripFilters');

/**
 * Injects the trip filters context provided by the trip list.
 * @returns {TripFiltersContext} Shared filter state, options and helpers.
 */
export const useTripFiltersContext = (): TripFiltersContext => {
    const ctx = inject(TRIP_FILTERS_KEY);
    if (!ctx) {
        throw new Error(
            'useTripFiltersContext must be used within a trip list'
        );
    }
    return ctx;
};
