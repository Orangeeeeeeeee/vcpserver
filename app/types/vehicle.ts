export type VehicleType =
    | 'car'
    | 'minibus'
    | 'truck'
    | 'motorcycle'
    | 'bus'
    | 'trailer';

export type VehicleFuel = 'petrol' | 'diesel' | 'gas' | 'electric';

export type VehicleCondition = 'active' | 'repair' | 'inactive';

/** Live motion state shown in the table's first column */
export type VehicleMotionStatus = 'moving' | 'idle' | 'stopped' | 'offline';

/** Fuel consumption per driving mode, liters per 100 km */
export interface VehicleFuelConsumption {
    average?: number;
    slow?: number;
    normal?: number;
    fast?: number;
}

/** Fuel tank volumes, liters */
export interface VehicleTanks {
    main?: number;
    extra?: number;
}

/** Speed limits, km/h */
export interface VehicleSpeedLimits {
    normal?: number;
    max?: number;
}

export interface Vehicle {
    id: string;
    /** Vehicle name / identifier, e.g. "TRK-112" */
    name: string;
    /** Owning company, e.g. "Logistics UA" */
    company: string;
    /** Brand, e.g. "MAN" */
    brand: string;
    /** Model, e.g. "TGX 18.480" */
    model: string;
    /** Production year, e.g. 2020 */
    year?: number;
    vin?: string;
    type: VehicleType;
    fuel?: VehicleFuel;
    condition?: VehicleCondition;
    /** Country code, e.g. "UA" */
    country?: string;
    /** Registration address */
    regAddress?: string;
    /** Assigned driver id (resolved against `useDrivers`) */
    driverId?: string;
    /** Assigned route names */
    routes?: string[];
    /** Linked GPS tracker IMEI (resolved against `useTrackers`) */
    trackerImei?: string;
    /** Transport group ids (resolved against `useGroups`) */
    groupIds?: string[];
    /** Whether the vehicle operates as a passenger carrier */
    carrier: boolean;
    /** Passenger seat count (carrier only) */
    seats?: number;
    /** Optional free-text comment */
    comment?: string;
    /** Odometer reading, km */
    odometer?: number;
    /** Display-ready odometer reading date, e.g. "12.04.2024" */
    odometerDate?: string;
    /** Engine hours total */
    engineHours?: number;
    /** Display-ready engine hours reading date */
    engineHoursDate?: string;
    fuelConsumption?: VehicleFuelConsumption;
    tanks?: VehicleTanks;
    speedLimits?: VehicleSpeedLimits;
    motionStatus: VehicleMotionStatus;
    /** Display-ready current address (table column) */
    address: string;
    /** Display-ready "updated ago" label, e.g. "23 хв тому" */
    updatedAgo: string;
}
