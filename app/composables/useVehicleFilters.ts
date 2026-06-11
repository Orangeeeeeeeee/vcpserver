import type { Vehicle, VehicleType } from '~/types/vehicle';

/** Reactive filter state for the vehicles table (live filtering, no Apply) */
export interface VehicleFilterState {
    companies: string[];
    types: VehicleType[];
}

/**
 * Reactive state, option lists and the `matches` predicate for the vehicles
 * filter popover. Created once in the vehicles page and shared with the filter
 * panel via provide/inject — mirrors `useGroupFilters`.
 *
 * Return type is intentionally inferred so it flows through
 * `VehicleFiltersContext` without hand-typing.
 */
export const useVehicleFilters = () => {
    const { t } = useI18n();
    const { companies, types } = useVehicles();

    const emptyState = (): VehicleFilterState => ({
        companies: [],
        types: []
    });

    const state = reactive<VehicleFilterState>(emptyState());

    /** Type options: VehicleType value + localized label */
    const typeOptions = computed(() =>
        types.map((o) => ({ value: o.value, label: t(o.labelKey) }))
    );

    /**
     * True when a vehicle passes every ACTIVE filter (a filter is ignored when
     * its selection is empty). AND across filters, OR within a multiselect.
     */
    const matches = (vehicle: Vehicle): boolean => {
        if (
            state.companies.length &&
            !state.companies.includes(vehicle.company)
        ) {
            return false;
        }

        if (state.types.length && !state.types.includes(vehicle.type)) {
            return false;
        }

        return true;
    };

    /** Number of active filters (for the button badge) */
    const activeCount = computed<number>(() => {
        let count = 0;
        if (state.companies.length) count++;
        if (state.types.length) count++;
        return count;
    });

    /** Clears all filters back to the empty state */
    const reset = (): void => {
        Object.assign(state, emptyState());
    };

    return {
        state,
        companies,
        typeOptions,
        matches,
        activeCount,
        reset
    };
};

/** Shape shared between the vehicles page (provider) and VehicleFilters (consumer) */
export type VehicleFiltersContext = ReturnType<typeof useVehicleFilters>;

/** Injection key for the vehicle filters context */
export const VEHICLE_FILTERS_KEY: InjectionKey<VehicleFiltersContext> =
    Symbol('vehicleFilters');

/**
 * Injects the vehicle filters context provided by the vehicles page.
 * @returns {VehicleFiltersContext} Shared filter state, options and helpers.
 */
export const useVehicleFiltersContext = (): VehicleFiltersContext => {
    const ctx = inject(VEHICLE_FILTERS_KEY);
    if (!ctx) {
        throw new Error(
            'useVehicleFiltersContext must be used within the vehicles page'
        );
    }
    return ctx;
};
