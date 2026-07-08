/** Live status of a vehicle on the online map (mirrors the map legend) */
export type OnlineStatus =
    | 'moving'
    | 'speeding'
    | 'speedingHard'
    | 'idleEngine'
    | 'stopped'
    | 'warning'
    | 'accident';

/** Accent color key of an online group (maps to `primitiveColors`) */
export type OnlineGroupColor = 'violet' | 'amber' | 'teal';

export interface OnlineGroup {
    id: string;
    /** Display name, e.g. "Logistics UA" */
    name: string;
    color: OnlineGroupColor;
    /** Optional description shown when the group header is expanded */
    description?: string;
}

/** Label→value row of the telemetry / additional-data sections. Labels come
 * as-is from the device/API (arbitrary set), so they are plain strings. */
export interface OnlineDetailEntry {
    label: string;
    value: string;
}

/** Today's activity stats («Статистика за сьогодні»); labels are fixed i18n */
export interface OnlineDayStats {
    /** Time with ignition on, "HH:MM" */
    ignitionTime: string;
    /** Idle time, "HH:MM" */
    idleTime: string;
    /** Departure time, "HH:MM" */
    departureTime: string;
    /** Arrival time, "HH:MM"; missing while the vehicle is still out */
    arrivalTime?: string;
    /** Today's mileage, km */
    mileageKm: number;
    /** Today's max speed, km/h */
    maxSpeed: number;
}

export interface VehicleCamera {
    id: string;
    /** 1-based display number («Камера {n}») */
    number: number;
}

/** Extra sections of the vehicle detail page («Онлайн» tab) */
export interface OnlineVehicleDetail {
    stats: OnlineDayStats;
    telemetry: OnlineDetailEntry[];
    additional: OnlineDetailEntry[];
    /** Onboard cameras; empty when the vehicle has no video system */
    cameras: VehicleCamera[];
}

export interface OnlineVehicle {
    id: string;
    /** Owning group id (resolved against the online groups) */
    groupId: string;
    /** Model display name, e.g. "Mercedes-Benz Sprinter 519 CDI" */
    name: string;
    /** Vehicle identifier, e.g. "BUS-047" */
    vehicleId: string;
    status: OnlineStatus;
    /** Current speed, km/h */
    speed: number;
    /** Display-ready "updated ago" label, e.g. "23 хв тому" */
    updatedAgo: string;
    imei: string;
    /** Display-ready current address */
    address: string;
    /** Vehicle type label key (objects.vehicles.types.*) */
    typeKey: string;
    /** Assigned driver name */
    driver: string;
    /** Shows the «Пасажирські перевезення» badge when true */
    passenger?: boolean;
    /** Optional free-text note shown in the expanded card */
    comment?: string;
    lat: number;
    lng: number;
}
