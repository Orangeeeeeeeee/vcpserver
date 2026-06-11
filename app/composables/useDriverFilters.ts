import type { Driver, DriverStatus } from '~/types/driver';
import { primitiveColors } from '~/theme/colors';

/** Reactive filter state for the drivers grid (live filtering, no Apply) */
export interface DriverFilterState {
    company: string | null;
    statuses: DriverStatus[];
    employment: string[];
    categories: string[];
    /** Selected vehicle transportIds (e.g. "TRK-112") */
    vehicles: string[];
}

/** A vehicle option group rendered with a colored dot header */
export interface VehicleGroup {
    label: string;
    color: string;
    items: { label: string; value: string }[];
}

/**
 * Reactive state, option lists and the `matches` predicate for the drivers
 * filter popover. Created once in the drivers page and shared with the filter
 * panel via provide/inject — mirrors `useDriverForm`.
 *
 * Return type is intentionally inferred so it flows through
 * `DriverFiltersContext` without hand-typing.
 */
export const useDriverFilters = () => {
    const { t } = useI18n();
    const { companies, statuses, employmentTypes, licenseCategories } =
        useDrivers();

    const emptyState = (): DriverFilterState => ({
        company: null,
        statuses: [],
        employment: [],
        categories: [],
        vehicles: []
    });

    const state = reactive<DriverFilterState>(emptyState());

    /** Status options: DriverStatus value + localized label */
    const statusOptions = computed(() =>
        statuses.map((s) => ({ value: s.value, label: t(s.labelKey) }))
    );

    /** Single license categories A/B/C/D/E (plain strings) */
    const licenseCategoryOptions = licenseCategories;

    /**
     * Mock grouped vehicles. Values are real driver transportIds
     * (driver.transportId === `TRK-${112 + i}`) so the filter narrows the grid.
     */
    const vehicleGroups: VehicleGroup[] = [
        {
            label: t('objects.drivers.filters.group1'),
            color: primitiveColors.green['500'],
            items: [
                { label: 'MAN TGX 18.480 (TRK-112)', value: 'TRK-112' },
                { label: 'Volvo FH 460 (TRK-113)', value: 'TRK-113' },
                { label: 'Scania R 500 (TRK-114)', value: 'TRK-114' },
                { label: 'Mercedes Actros (TRK-115)', value: 'TRK-115' },
                { label: 'DAF XF 480 (TRK-116)', value: 'TRK-116' }
            ]
        },
        {
            label: t('objects.drivers.filters.group2'),
            color: primitiveColors.red['500'],
            items: [
                { label: 'Iveco Stralis (TRK-117)', value: 'TRK-117' },
                { label: 'MAN TGX 18.480 (TRK-118)', value: 'TRK-118' },
                { label: 'Volvo FH 460 (TRK-119)', value: 'TRK-119' },
                { label: 'Scania R 500 (TRK-120)', value: 'TRK-120' },
                { label: 'Mercedes Actros (TRK-121)', value: 'TRK-121' }
            ]
        }
    ];

    /**
     * True when a driver passes every ACTIVE filter (a filter is ignored when
     * its selection is empty/null). AND across filters, OR within a multiselect.
     */
    const matches = (driver: Driver): boolean => {
        if (state.company && driver.company !== state.company) return false;

        if (state.statuses.length && !state.statuses.includes(driver.status)) {
            return false;
        }

        if (
            state.employment.length &&
            !state.employment.includes(driver.employment)
        ) {
            return false;
        }

        if (state.categories.length) {
            // license.categories is a joined string like "B, C"
            const driverCats = driver.license.categories
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean);
            if (!state.categories.some((c) => driverCats.includes(c))) {
                return false;
            }
        }

        if (
            state.vehicles.length &&
            !state.vehicles.includes(driver.transportId)
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
        if (state.employment.length) count++;
        if (state.categories.length) count++;
        if (state.vehicles.length) count++;
        return count;
    });

    /** Clears all filters back to the empty state */
    const reset = (): void => {
        Object.assign(state, emptyState());
    };

    return {
        state,
        companies,
        statusOptions,
        employmentTypes,
        licenseCategoryOptions,
        vehicleGroups,
        matches,
        activeCount,
        reset
    };
};

/** Shape shared between the drivers page (provider) and DriverFilters (consumer) */
export type DriverFiltersContext = ReturnType<typeof useDriverFilters>;

/** Injection key for the driver filters context */
export const DRIVER_FILTERS_KEY: InjectionKey<DriverFiltersContext> =
    Symbol('driverFilters');

/**
 * Injects the driver filters context provided by the drivers page.
 * @returns {DriverFiltersContext} Shared filter state, options and helpers.
 */
export const useDriverFiltersContext = (): DriverFiltersContext => {
    const ctx = inject(DRIVER_FILTERS_KEY);
    if (!ctx) {
        throw new Error(
            'useDriverFiltersContext must be used within the drivers page'
        );
    }
    return ctx;
};
