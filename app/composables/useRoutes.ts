import { generateRoutes } from '~/mocks/routes';
import type { Route } from '~/types/route';

/** Fields needed to create a route; the id is assigned automatically */
export type CreateRouteInput = Omit<Route, 'id'>;

/** Return type of the {@link useRoutes} composable */
export interface UseRoutesReturn {
    /** Shared, reactive list of routes (regular and scheduled) */
    routes: Ref<Route[]>;
    /** Prepends a new route with a generated id */
    createRoute: (route: CreateRouteInput) => Route;
    /** Replaces the route with the same id */
    updateRoute: (route: Route) => void;
    /** Removes the route with the given id */
    deleteRoute: (id: string) => void;
}

/**
 * Provides the (mock) list of routes, shared across the app via useState.
 * Seeded with the deterministic mock catalog; routes created through the
 * form are prepended on top of it.
 * @returns {UseRoutesReturn} Composable
 */
export const useRoutes = (): UseRoutesReturn => {
    const routes = useState<Route[]>('routes', () => generateRoutes());

    /** Prepends a new route with a computed id. */
    const createRoute = (route: CreateRouteInput): Route => {
        const nextId =
            Math.max(0, ...routes.value.map((r) => Number(r.id) || 0)) + 1;
        const newRoute: Route = { ...route, id: String(nextId) };
        routes.value = [newRoute, ...routes.value];
        return newRoute;
    };

    /** Replaces the route with the same id. */
    const updateRoute = (route: Route): void => {
        routes.value = routes.value.map((r) => (r.id === route.id ? route : r));
    };

    /** Removes the route with the given id. */
    const deleteRoute = (id: string): void => {
        routes.value = routes.value.filter((r) => r.id !== id);
    };

    return { routes, createRoute, updateRoute, deleteRoute };
};
