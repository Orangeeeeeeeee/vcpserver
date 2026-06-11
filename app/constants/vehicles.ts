import type {
    VehicleCondition,
    VehicleMotionStatus,
    VehicleType
} from '~/types/vehicle';

/** Tabler icon per vehicle type (shared by the table, filters and the form) */
export const VEHICLE_TYPE_ICONS: Record<VehicleType, string> = {
    car: 'tabler:car',
    minibus: 'tabler:truck-delivery',
    truck: 'tabler:truck',
    motorcycle: 'tabler:motorbike',
    bus: 'tabler:bus',
    trailer: 'tabler:caravan'
};

/** Color class of the type icon per vehicle condition (table's type column) */
export const VEHICLE_CONDITION_CLASSES: Record<VehicleCondition, string> = {
    active: 'text-green-500',
    repair: 'text-amber-500',
    inactive: 'text-red-500'
};

/** Icon + color class per motion status (table's first column) */
export const VEHICLE_MOTION_META: Record<
    VehicleMotionStatus,
    { icon: string; class: string }
> = {
    moving: { icon: 'tabler:navigation', class: 'text-green-500' },
    idle: { icon: 'tabler:navigation', class: 'text-amber-500' },
    stopped: { icon: 'tabler:navigation', class: 'text-red-500' },
    offline: { icon: 'tabler:navigation-off', class: 'text-surface-500' }
};
