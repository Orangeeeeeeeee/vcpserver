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
