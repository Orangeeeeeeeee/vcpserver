import { ROUTES } from './routes';

export interface NavigationItem {
    /** i18n translation key */
    key: string;
    /** Icon name (Iconify format) */
    icon: string;
    /** Route path */
    route: string;
    /** Extra path prefixes of section pages living outside `route` that also mark this item as active */
    activePrefixes?: string[];
}

/** Sidebar navigation items */
export const navigationItems: NavigationItem[] = [
    {
        key: 'objects',
        icon: 'tabler:bus',
        route: ROUTES.OBJECTS,
        activePrefixes: [ROUTES.VEHICLES, ROUTES.DRIVERS]
    },
    { key: 'routes', icon: 'tabler:route', route: ROUTES.ROUTES_PAGE },
    { key: 'zones', icon: 'tabler:border-radius', route: ROUTES.ZONES },
    { key: 'reports', icon: 'tabler:file-text', route: ROUTES.REPORTS },
    {
        key: 'passengerFlow',
        icon: 'tabler:chart-bar',
        route: ROUTES.PASSENGER_FLOW,
        activePrefixes: [ROUTES.PASSENGER_FLOW_TRANSPORT]
    }
];
