import type { RoutePointType } from '~/types/route';
import type { RoutePointColor } from '~/constants/route-form';
import { ROUTE_START_COLOR, ROUTE_FINISH_COLOR } from '~/constants/route-form';

/** Visual identity of a route point on the detail page (feed + map legend) */
export interface RoutePointViewMeta {
    /** Iconify icon shown in the feed box and the map legend */
    icon: string;
    /** Tailwind text color class of the icon */
    textClass: string;
    /** Palette accent of the point badge and its map marker */
    badgeColor: RoutePointColor;
    /** i18n key of the badge/legend label */
    labelKey: string;
}

/** View metadata of the start point */
export const ROUTE_START_VIEW_META: RoutePointViewMeta = {
    icon: 'tabler:flag',
    textClass: 'text-green-600',
    badgeColor: ROUTE_START_COLOR,
    labelKey: 'routes.create.points.start'
};

/** View metadata of the finish point */
export const ROUTE_FINISH_VIEW_META: RoutePointViewMeta = {
    icon: 'tabler:flag',
    textClass: 'text-red-500',
    badgeColor: ROUTE_FINISH_COLOR,
    labelKey: 'routes.create.points.finish'
};

/** View metadata per intermediate point type */
export const ROUTE_POINT_TYPE_VIEW_META: Record<
    RoutePointType,
    RoutePointViewMeta
> = {
    stop: {
        icon: 'tabler:player-pause',
        textClass: 'text-surface-700',
        badgeColor: 'rose',
        labelKey: 'routes.create.points.pointTypes.stop'
    },
    busStation: {
        icon: 'tabler:bus-stop',
        textClass: 'text-amber-600',
        badgeColor: 'amber',
        labelKey: 'routes.create.points.pointTypes.busStation'
    },
    checkpoint: {
        icon: 'tabler:map-pin',
        textClass: 'text-teal-600',
        badgeColor: 'teal',
        labelKey: 'routes.create.points.pointTypes.checkpoint'
    },
    technicalStop: {
        icon: 'tabler:tool',
        textClass: 'text-sky-600',
        badgeColor: 'sky',
        labelKey: 'routes.create.points.pointTypes.technicalStop'
    },
    rest: {
        icon: 'tabler:zzz',
        textClass: 'text-green-600',
        badgeColor: 'green',
        labelKey: 'routes.create.points.pointTypes.rest'
    }
};

/** Movement («Рух») segment icon between two feed points */
export const ROUTE_MOVEMENT_VIEW_META = {
    icon: 'tabler:send',
    textClass: 'text-green-600'
} as const;

/** Map legend rows of the route detail map, in display order */
export const ROUTE_VIEW_LEGEND: RoutePointViewMeta[] = [
    ROUTE_START_VIEW_META,
    ROUTE_POINT_TYPE_VIEW_META.checkpoint,
    ROUTE_POINT_TYPE_VIEW_META.stop,
    ROUTE_POINT_TYPE_VIEW_META.busStation,
    ROUTE_POINT_TYPE_VIEW_META.technicalStop,
    ROUTE_POINT_TYPE_VIEW_META.rest,
    ROUTE_FINISH_VIEW_META
];
