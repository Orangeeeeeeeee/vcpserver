/** Lifecycle status of a route group */
export type RouteGroupStatus = 'active' | 'inactive';

/** A named group of routes shown on the «Групи» page of the routes section */
export interface RouteGroup {
    id: string;
    /** Display name, e.g. "Негабаритні перевезення" */
    name: string;
    /** Owning company, e.g. "Logistics UA" */
    company: string;
    status: RouteGroupStatus;
    /** Manual sort position («Номер за порядком»), ascending on the grid */
    order: number;
    /** Optional free-text comment shown on the card (clamped to 3 lines) */
    comment?: string;
    /** Ordered list of route ids in the group */
    routeIds: string[];
}
