import type { RouteStatus } from '~/types/route';

/** Display metadata of a route status */
export interface RouteStatusMeta {
    /** i18n key of the status label */
    labelKey: string;
    /** Tailwind class of the status dot next to the route name */
    dotClass: string;
}

/** Route statuses in display order (filter and edit-form selects) */
export const ROUTE_STATUSES: RouteStatus[] = ['active', 'inactive'];

/** Display metadata per route status; new statuses only need a row here */
export const ROUTE_STATUS_META: Record<RouteStatus, RouteStatusMeta> = {
    active: {
        labelKey: 'routes.list.statuses.active',
        dotClass: 'bg-green-500'
    },
    inactive: {
        labelKey: 'routes.list.statuses.inactive',
        dotClass: 'bg-red-500'
    }
};
