import type { Group, GroupStatus } from '~/types/group';

/** Reactive filter state for the groups grid (live filtering, no Apply) */
export interface GroupFilterState {
    companies: string[];
    statuses: GroupStatus[];
}

/**
 * Reactive state, option lists and the `matches` predicate for the groups
 * filter popover. Created once in the groups page and shared with the filter
 * panel via provide/inject — mirrors `useDriverFilters`.
 *
 * Return type is intentionally inferred so it flows through
 * `GroupFiltersContext` without hand-typing.
 */
export const useGroupFilters = () => {
    const { t } = useI18n();
    const { companies, statuses } = useGroups();

    const emptyState = (): GroupFilterState => ({
        companies: [],
        statuses: []
    });

    const state = reactive<GroupFilterState>(emptyState());

    /** Status options: GroupStatus value + localized label */
    const statusOptions = computed(() =>
        statuses.map((s) => ({ value: s.value, label: t(s.labelKey) }))
    );

    /**
     * True when a group passes every ACTIVE filter (a filter is ignored when
     * its selection is empty). AND across filters, OR within a multiselect.
     */
    const matches = (group: Group): boolean => {
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

/** Shape shared between the groups page (provider) and GroupFilters (consumer) */
export type GroupFiltersContext = ReturnType<typeof useGroupFilters>;

/** Injection key for the group filters context */
export const GROUP_FILTERS_KEY: InjectionKey<GroupFiltersContext> =
    Symbol('groupFilters');

/**
 * Injects the group filters context provided by the groups page.
 * @returns {GroupFiltersContext} Shared filter state, options and helpers.
 */
export const useGroupFiltersContext = (): GroupFiltersContext => {
    const ctx = inject(GROUP_FILTERS_KEY);
    if (!ctx) {
        throw new Error(
            'useGroupFiltersContext must be used within the groups page'
        );
    }
    return ctx;
};
