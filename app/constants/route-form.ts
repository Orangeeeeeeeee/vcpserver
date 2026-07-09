import type { RoutePointType } from '~/types/route';
import type { primitiveColors } from '~/theme/colors';

/** A route point type paired with its i18n label key */
export interface RoutePointTypeOption {
    value: RoutePointType;
    labelKey: string;
}

/** «Тип точки» select options in display order */
export const ROUTE_POINT_TYPE_OPTIONS: RoutePointTypeOption[] = [
    { value: 'stop', labelKey: 'routes.create.points.pointTypes.stop' },
    {
        value: 'busStation',
        labelKey: 'routes.create.points.pointTypes.busStation'
    },
    {
        value: 'checkpoint',
        labelKey: 'routes.create.points.pointTypes.checkpoint'
    },
    {
        value: 'technicalStop',
        labelKey: 'routes.create.points.pointTypes.technicalStop'
    },
    { value: 'rest', labelKey: 'routes.create.points.pointTypes.rest' }
];

/** Bounds of the point radius input/slider, in meters */
export const ROUTE_POINT_RADIUS = {
    min: 10,
    max: 200,
    step: 5,
    default: 50
} as const;

/** Palette key of a route point accent color (maps to `primitiveColors`) */
export type RoutePointColor = keyof typeof primitiveColors;

/** Accent color of the start point badge and marker */
export const ROUTE_START_COLOR: RoutePointColor = 'indigo';

/** Accent color of the finish point badge and marker */
export const ROUTE_FINISH_COLOR: RoutePointColor = 'violet';

/** Intermediate point accent colors, rotated by point order */
export const ROUTE_INTERMEDIATE_COLORS: RoutePointColor[] = [
    'teal',
    'sky',
    'rose',
    'amber'
];

/** Tariff matrix point accent colors, rotated by matrix order */
export const ROUTE_TARIFF_COLORS: RoutePointColor[] = [
    'teal',
    'sky',
    'rose',
    'violet',
    'amber',
    'indigo'
];

/** Radius (km) within which a map pick snaps to a mock catalog address */
export const ROUTE_PICK_SNAP_KM = 2;
