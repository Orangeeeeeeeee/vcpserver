import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import type { RouteGroup, RouteGroupStatus } from '~/types/route-group';
import type { AddRouteGroupInput } from '~/composables/useRouteGroups';

/** Identifier of a tab in the route group form dialog */
export type RouteGroupFormTabKey = 'general' | 'routes';

export interface RouteGroupFormState {
    name: string;
    company: string | null;
    status: RouteGroupStatus | null;
    /** Manual sort position («Номер за порядком») */
    order: number | null;
    comment: string;
    /** Ordered route id list (drag order is preserved on save) */
    routeIds: string[];
}

/** A MultiSelect option of the «Маршрути» tab */
export interface RouteGroupRouteOption {
    value: string;
    label: string;
}

/**
 * State, validation and helpers for the route group add/edit form. Created
 * once in `RoutesGroupsFormDialog` and shared with the tab components via
 * provide/inject — mirrors `useGroupForm`.
 *
 * Note: the return type is intentionally inferred (not an explicit interface)
 * so the regle `r$` type flows through `RouteGroupFormContext` without
 * hand-typing it.
 */
export const useRouteGroupForm = () => {
    const { companies, statuses } = useRouteGroups();
    const { routes } = useRoutes();
    const { t } = useI18n();

    /** Builds the empty (add-mode) form state */
    const emptyState = (): RouteGroupFormState => ({
        name: '',
        company: null,
        status: null,
        order: null,
        comment: '',
        routeIds: []
    });

    const state = reactive<RouteGroupFormState>(emptyState());

    const { r$ } = useRegle(
        state,
        {
            name: { required: withMessage(required, 'validation.required') },
            company: { required: withMessage(required, 'validation.required') },
            status: { required: withMessage(required, 'validation.required') },
            order: { required: withMessage(required, 'validation.required') }
        },
        { lazy: true }
    );

    /** Status select options: RouteGroupStatus value + localized label */
    const statusOptions = computed(() =>
        statuses.map((s) => ({ value: s.value, label: t(s.labelKey) }))
    );

    /** Route select options: "Київ — Львів (№12)" (id disambiguates same-name routes) */
    const routeOptions = computed<RouteGroupRouteOption[]>(() =>
        routes.value.map((route) => ({
            value: route.id,
            label: `${route.name} (№${route.id})`
        }))
    );

    /** Display name of a selected route row; falls back to the raw id */
    const routeNameOf = (id: string): string =>
        routes.value.find((route) => route.id === id)?.name ?? id;

    /**
     * MultiSelect model over the ordered route id list. Setter keeps existing
     * rows in their (drag) order and appends new picks at the end;
     * deselecting removes the matching row.
     */
    const selectedRouteIds = computed<string[]>({
        get: () => state.routeIds,
        set: (ids) => {
            const kept = state.routeIds.filter((id) => ids.includes(id));
            const keptIds = new Set(kept);
            const added = ids.filter((id) => !keptIds.has(id));
            state.routeIds = [...kept, ...added];
        }
    });

    /** Removes a route row (also unselects it in the MultiSelect) */
    const removeRoute = (index: number): void => {
        state.routeIds.splice(index, 1);
    };

    /** Resets to empty (add) or hydrates from the group (edit) */
    const hydrate = (group: RouteGroup | null): void => {
        Object.assign(state, emptyState());

        if (group) {
            state.name = group.name;
            state.company = group.company;
            state.status = group.status;
            state.order = group.order;
            state.comment = group.comment ?? '';
            state.routeIds = [...group.routeIds];
        }

        r$.$reset();
    };

    /** Maps the first invalid regle field to its owning tab (cross-tab UX) */
    const firstInvalidTab = (): RouteGroupFormTabKey => {
        // all validated fields currently live on the General tab
        return 'general';
    };

    /** Builds the group payload from the current (validated) form state */
    const buildPayload = (): AddRouteGroupInput => ({
        name: state.name.trim(),
        company: state.company as string,
        status: state.status as RouteGroupStatus,
        order: state.order as number,
        comment: state.comment.trim() || undefined,
        routeIds: [...state.routeIds]
    });

    return {
        state,
        r$,
        companies,
        statusOptions,
        routeOptions,
        routeNameOf,
        selectedRouteIds,
        removeRoute,
        hydrate,
        firstInvalidTab,
        buildPayload
    };
};

/** Shape shared between RoutesGroupsFormDialog (provider) and its tabs (consumers) */
export type RouteGroupFormContext = ReturnType<typeof useRouteGroupForm>;

/** Injection key for the route group form context */
export const ROUTE_GROUP_FORM_KEY: InjectionKey<RouteGroupFormContext> =
    Symbol('routeGroupForm');

/**
 * Injects the route group form context provided by `RoutesGroupsFormDialog`.
 * @returns {RouteGroupFormContext} The shared form state, validation and helpers.
 */
export const useRouteGroupFormContext = (): RouteGroupFormContext => {
    const ctx = inject(ROUTE_GROUP_FORM_KEY);
    if (!ctx) {
        throw new Error(
            'useRouteGroupFormContext must be used within RoutesGroupsFormDialog'
        );
    }
    return ctx;
};
