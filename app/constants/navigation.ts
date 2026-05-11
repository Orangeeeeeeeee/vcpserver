import { ROUTES } from './routes';

export interface NavigationItem {
    /** i18n translation key */
    key: string;
    /** Icon name (Iconify format) */
    icon: string;
    /** Route path */
    route: string;
}

/** Sidebar navigation items */
export const navigationItems: NavigationItem[] = [
    { key: 'objects', icon: 'tabler:bus', route: ROUTES.OBJECTS },
    { key: 'routes', icon: 'tabler:route', route: ROUTES.ROUTES_PAGE },
    { key: 'zones', icon: 'tabler:border-radius', route: ROUTES.ZONES },
    { key: 'reports', icon: 'tabler:file-text', route: ROUTES.REPORTS },
    {
        key: 'passengerFlow',
        icon: 'tabler:chart-bar',
        route: ROUTES.PASSENGER_FLOW
    }
];
