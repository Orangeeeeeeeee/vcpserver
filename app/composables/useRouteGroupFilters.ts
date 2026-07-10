import type { RouteGroup, RouteGroupStatus } from '~/types/route-group';

/** Reactive filter state for the route groups grid (live filtering, no Apply) */
export interface RouteGroupFilterState {
    companies: string[];
    statuses: RouteGroupStatus[];
}

/**
 * Reactive state, option lists and the `matches` predicate for the route
 * groups filter popover. Created once in the groups page and shared with the
 * filter panel via provide/inject — mirrors `useGroupFilters`.
 *
 * Return type is intentionally inferred so it flows through
 * `RouteGroupFiltersContext` without hand-typing.
 */
export const useRouteGroupFilters = () => {
    const { t } = useI18n();
    const { companies, statuses } = useRouteGroups();

    const emptyState = (): RouteGroupFilterState => ({
        companies: [],
        statuses: []
    });

    const state = reactive<RouteGroupFilterState>(emptyState());

    /** Status options: RouteGroupStatus value + localized label */
    const statusOptions = computed(() =>
        statuses.map((s) => ({ value: s.value, label: t(s.labelKey) }))
    );

    /**
     * True when a group passes every ACTIVE filter (a filter is ignored when
     * its selection is empty). AND across filters, OR within a multiselect.
     */
    const matches = (group: RouteGroup): boolean => {
        if (
            state.companies.length &&
            !state.companies.includes(group.company)
        ) {
            return false;
        }

        if (state.statuses.length && !state.statuses.includes(group.status)) {
            return false;
        }

        return true;
    };

    /** Number of active filters (for the button badge) */
    const activeCount = computed<number>(() => {
        let count = 0;
        if (state.companies.length) count++;
        if (state.statuses.length) count++;
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
        matches,
        activeCount,
        reset
    };
};

/** Shape shared between the groups page (provider) and the filters popover (consumer) */
export type RouteGroupFiltersContext = ReturnType<typeof useRouteGroupFilters>;

/** Injection key for the route group filters context */
export const ROUTE_GROUP_FILTERS_KEY: InjectionKey<RouteGroupFiltersContext> =
    Symbol('routeGroupFilters');

/**
 * Injects the route group filters context provided by the groups page.
 * @returns {RouteGroupFiltersContext} Shared filter state, options and helpers.
 */
export const useRouteGroupFiltersContext = (): RouteGroupFiltersContext => {
    const ctx = inject(ROUTE_GROUP_FILTERS_KEY);
    if (!ctx) {
        throw new Error(
            'useRouteGroupFiltersContext must be used within the route groups page'
        );
    }
    return ctx;
};
