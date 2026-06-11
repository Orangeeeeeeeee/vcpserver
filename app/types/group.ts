export type GroupStatus = 'active' | 'inactive';

/** Palette key of the group accent color (maps to `primitiveColors`) */
export type GroupColor =
    | 'indigo'
    | 'teal'
    | 'violet'
    | 'sky'
    | 'rose'
    | 'amber';

/** Vehicle kind used to pick the row icon */
export type GroupVehicleType = 'truck' | 'bus' | 'van';

export interface GroupVehicle {
    /** Transport model, e.g. "MAN TGX 18.480" */
    transport: string;
    /** Transport identifier, e.g. "TRK-112" */
    transportId: string;
    type: GroupVehicleType;
}

export interface Group {
    id: string;
    /** Display name, e.g. "Вантажні перевезення 1" */
    name: string;
    /** Owning company, e.g. "Logistics UA" */
    company: string;
    status: GroupStatus;
    /** Manual sort position («Номер за порядком»), ascending on the grid */
    order: number;
    /** Optional free-text comment shown on the card (clamped to 3 lines) */
    comment?: string;
    color: GroupColor;
    /** Ordered list of vehicles in the group */
    vehicles: GroupVehicle[];
}
