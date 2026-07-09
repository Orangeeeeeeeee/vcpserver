import type { Route } from '~/types/route';
import type { LeafletMapLayer } from '~/composables/useLeafletMap';

/** Id of the route map wrapper element (fullscreen target) */
export const ROUTE_VIEW_MAP_WRAPPER_ID = 'route-view-map-wrapper';

export interface UseRouteDetailFromRouteReturn {
    /** Route resolved from the `[id]` param, narrowed by the 404 guard */
    route: ComputedRef<Route>;
}

/**
 * Resolves the viewed route from the `[id]` route param against the shared
 * routes state. Throws a fatal 404 when the id is unknown — mirrors
 * `useOnlineVehicleFromRoute` of the vehicle detail page.
 * @returns {UseRouteDetailFromRouteReturn} The resolved route.
 */
export const useRouteDetailFromRoute = (): UseRouteDetailFromRouteReturn => {
    const { t } = useI18n();
    const currentRoute = useRoute();
    const { routes } = useRoutes();

    const found = computed<Route | undefined>(() =>
        routes.value.find((r) => r.id === (currentRoute.params.id as string))
    );

    if (!found.value) {
        throw createError({
            statusCode: 404,
            statusMessage: t('routes.detail.notFound'),
            fatal: true
        });
    }

    const route = computed<Route>(() => found.value as Route);

    return { route };
};

/**
 * Shared state of the route detail page: the viewed route and the map
 * settings. Created once in the page and shared with the panel and the map
 * via provide/inject — mirrors `useVehicleOnline`.
 *
 * Return type is intentionally inferred so it flows through
 * `RouteViewContext` without hand-typing.
 *
 * @param route Route being viewed (already resolved and 404-guarded).
 */
export const useRouteView = (route: ComputedRef<Route>) => {
    /** Map base layer of the detail map */
    const mapLayer = ref<LeafletMapLayer>('streets');

    return { route, mapLayer };
};

/** Shape shared between the detail page (provider) and panel/map (consumers) */
export type RouteViewContext = ReturnType<typeof useRouteView>;

/** Injection key for the route view context */
export const ROUTE_VIEW_KEY: InjectionKey<RouteViewContext> =
    Symbol('routeView');

/**
 * Injects the route view context provided by the route detail page.
 * @returns {RouteViewContext} Shared route and map state.
 */
export const useRouteViewContext = (): RouteViewContext => {
    const ctx = inject(ROUTE_VIEW_KEY);
    if (!ctx) {
        throw new Error(
            'useRouteViewContext must be used within the route detail page'
        );
    }
    return ctx;
};
