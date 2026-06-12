import type { ReportCategory, ReportDefinition } from '~/types/report';
import { primitiveColors } from '~/theme/colors';
import { ROUTES } from '~/constants/routes';

/** Visual identity per category: tile/pill bg ('100' tint), icon ('500'), pill text ('700') */
export interface ReportCategoryMeta {
    bg: string;
    iconColor: string;
    textColor: string;
}

/** Category colors for catalog tiles and pills */
export const CATEGORY_META: Record<ReportCategory, ReportCategoryMeta> = {
    activity: {
        bg: primitiveColors.violet['100'],
        iconColor: primitiveColors.violet['500'],
        textColor: primitiveColors.violet['700']
    },
    routes: {
        bg: primitiveColors.rose['100'],
        iconColor: primitiveColors.rose['500'],
        textColor: primitiveColors.rose['700']
    },
    drivers: {
        bg: primitiveColors.sky['100'],
        iconColor: primitiveColors.sky['500'],
        textColor: primitiveColors.sky['700']
    },
    fuel: {
        bg: primitiveColors.teal['100'],
        iconColor: primitiveColors.teal['500'],
        textColor: primitiveColors.teal['700']
    }
};

/** Static report catalog (titles/descriptions live in i18n under reports.items.*) */
export const REPORT_DEFINITIONS: ReportDefinition[] = [
    { id: 'activity', category: 'activity', icon: 'tabler:bus' },
    {
        id: 'idle',
        category: 'activity',
        icon: 'tabler:clock',
        to: ROUTES.REPORTS_IDLE
    },
    { id: 'geozones', category: 'routes', icon: 'tabler:border-corners' },
    { id: 'trips', category: 'routes', icon: 'tabler:route' },
    { id: 'routeDeviation', category: 'routes', icon: 'tabler:arrows-split-2' },
    { id: 'driverActivity', category: 'drivers', icon: 'tabler:user' },
    { id: 'speeding', category: 'drivers', icon: 'tabler:gauge' },
    { id: 'drivingStyle', category: 'drivers', icon: 'tabler:steering-wheel' },
    { id: 'fuelCosts', category: 'fuel', icon: 'tabler:gas-station' },
    { id: 'fuelEfficiency', category: 'fuel', icon: 'tabler:droplet-bolt' },
    { id: 'fuelAnomalies', category: 'fuel', icon: 'tabler:bucket-droplet' }
];
