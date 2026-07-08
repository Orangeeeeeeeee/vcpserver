/** Application route paths */
export const ROUTES = {
    LOGIN: '/login',
    RESET_PASSWORD: '/reset-password',
    FORGOT_PASSWORD: '/forgot-password',
    OBJECTS: '/objects',
    OBJECTS_ONLINE: '/objects/online',
    OBJECTS_TRACKERS: '/objects/trackers',
    OBJECTS_DRIVERS: '/objects/drivers',
    OBJECTS_VEHICLES: '/objects/vehicles',
    OBJECTS_GROUPS: '/objects/groups',
    ROUTES_PAGE: '/routes',
    ZONES: '/zones',
    ZONES_NEW: '/zones/new',
    /** Zone detail page (e.g. /zones/3) */
    ZONE_DETAIL: (id: string): string => `/zones/${id}`,
    /** Zone edit page (e.g. /zones/3/edit) */
    ZONE_EDIT: (id: string): string => `/zones/${id}/edit`,
    REPORTS: '/reports',
    REPORTS_IDLE: '/reports/idle',
    PASSENGER_FLOW: '/passenger-flow',
    PASSENGER_FLOW_MAIN: '/passenger-flow/main-charts',
    PASSENGER_FLOW_ADDITIONAL: '/passenger-flow/additional-charts',
    PASSENGER_FLOW_TOTAL: '/passenger-flow/total-info',
    /** Passenger flow transport detail page */
    PASSENGER_FLOW_TRANSPORT_DETAIL: (id: string): string => `/transport/${id}`,
    /** Passenger flow trip detail page */
    PASSENGER_FLOW_TRIP_DETAIL: (transportId: string, tripId: string): string =>
        `/transport/${transportId}/${tripId}`,
    ACCOUNT: '/account',
    ACCOUNT_INFO: '/account/info',
    ACCOUNT_SETTINGS: '/account/settings',
    /** Vehicle detail page, «Онлайн» tab (e.g. /vehicles/on-3) */
    VEHICLE_DETAIL: (id: string): string => `/vehicles/${id}`,
    /** Vehicle history tab (page not implemented yet) */
    VEHICLE_HISTORY: (id: string): string => `/vehicles/${id}/history`,
    /** Vehicle active-trips page (not implemented yet) */
    VEHICLE_TRIPS_ACTIVE: (id: string): string =>
        `/vehicles/${id}/trips/active`,
    /** Vehicle archive-trips page (not implemented yet) */
    VEHICLE_TRIPS_ARCHIVE: (id: string): string =>
        `/vehicles/${id}/trips/archive`,
    /** Driver detail page (e.g. /drivers/42) */
    DRIVER_DETAIL: (id: string): string => `/drivers/${id}`,
    /** Driver active-trips page */
    DRIVER_TRIPS_ACTIVE: (id: string): string => `/drivers/${id}/trips/active`,
    /** Driver archive-trips page */
    DRIVER_TRIPS_ARCHIVE: (id: string): string => `/drivers/${id}/trips/archive`
} as const;
