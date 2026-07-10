import type { RouteGroup, RouteGroupStatus } from '~/types/route-group';
import { generateRouteGroups } from '~/mocks/route-groups';
import { mockCompanies } from '~/mocks/companies';

/** A route group status paired with its i18n label key */
export interface RouteGroupStatusOption {
    value: RouteGroupStatus;
    labelKey: string;
}

/** Fields needed to create a new route group; the composable fills the id */
export interface AddRouteGroupInput {
    name: string;
    company: string;
    status: RouteGroupStatus;
    order: number;
    comment?: string;
    routeIds: string[];
}

/** Input for updating an existing route group by id */
export interface UpdateRouteGroupInput extends AddRouteGroupInput {
    id: string;
}

/** Return type of the {@link useRouteGroups} composable */
export interface UseRouteGroupsReturn {
    /** Shared, reactive list of route groups */
    routeGroups: Ref<RouteGroup[]>;
    /** Distinct company names (for the filters and the group form) */
    companies: string[];
    /** Available statuses with i18n label keys (for filters and the form) */
    statuses: RouteGroupStatusOption[];
    /** Prepends a new route group to the list */
    addRouteGroup: (input: AddRouteGroupInput) => void;
    /** Updates an existing route group by id */
    updateRouteGroup: (input: UpdateRouteGroupInput) => void;
    /** Removes a route group from the list by id */
    deleteRouteGroup: (id: string) => void;
}

/** Route group statuses paired with their i18n label keys */
const ROUTE_GROUP_STATUSES: RouteGroupStatusOption[] = [
    { value: 'active', labelKey: 'routes.groups.card.statusActive' },
    { value: 'inactive', labelKey: 'routes.groups.card.statusInactive' }
];

/**
 * Provides the (mock) list of route groups, shared across the app via
 * useState. Filter / pagination are handled at the consumer level.
 * @returns {UseRouteGroupsReturn} Composable
 */
export const useRouteGroups = (): UseRouteGroupsReturn => {
    const routeGroups = useState<RouteGroup[]>('routeGroups', () =>
        generateRouteGroups()
    );

    /** Prepends a new route group with a computed id. */
    const addRouteGroup = (input: AddRouteGroupInput): void => {
        const nextId =
            Math.max(0, ...routeGroups.value.map((g) => Number(g.id) || 0)) +
            1;
        const newGroup: RouteGroup = { ...input, id: String(nextId) };
        routeGroups.value = [newGroup, ...routeGroups.value];
    };

    /** Replaces an existing route group by id. */
    const updateRouteGroup = (input: UpdateRouteGroupInput): void => {
        const idx = routeGroups.value.findIndex((g) => g.id === input.id);
        if (idx === -1) return;
        const updated: RouteGroup = {
            ...(routeGroups.value[idx] as RouteGroup),
            ...input
        };
        routeGroups.value = [
            ...routeGroups.value.slice(0, idx),
            updated,
            ...routeGroups.value.slice(idx + 1)
        ];
    };

    /** Removes the route group with the given id, if present. */
    const deleteRouteGroup = (id: string): void => {
        routeGroups.value = routeGroups.value.filter((g) => g.id !== id);
    };

    return {
        routeGroups,
        companies: mockCompanies,
        statuses: ROUTE_GROUP_STATUSES,
        addRouteGroup,
        updateRouteGroup,
        deleteRouteGroup
    };
};
