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
    REPORTS: '/reports',
    REPORTS_IDLE: '/reports/idle',
    PASSENGER_FLOW: '/passenger-flow',
    PASSENGER_FLOW_MAIN: '/passenger-flow/main-charts',
    PASSENGER_FLOW_ADDITIONAL: '/passenger-flow/additional-charts',
    PASSENGER_FLOW_TOTAL: '/passenger-flow/total-info',
    /** Passenger flow transport detail page */
    PASSENGER_FLOW_TRANSPORT_DETAIL: (id: string): string => `/transport/${id}`,
    ACCOUNT: '/account',
    ACCOUNT_INFO: '/account/info',
    ACCOUNT_SETTINGS: '/account/settings',
    /** Driver detail page (e.g. /drivers/42) */
    DRIVER_DETAIL: (id: string): string => `/drivers/${id}`,
    /** Driver active-trips page */
    DRIVER_TRIPS_ACTIVE: (id: string): string => `/drivers/${id}/trips/active`,
    /** Driver archive-trips page */
    DRIVER_TRIPS_ARCHIVE: (id: string): string => `/drivers/${id}/trips/archive`
} as const;
