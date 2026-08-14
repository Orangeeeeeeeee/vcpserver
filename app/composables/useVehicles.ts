import type {
    Vehicle,
    VehicleCondition,
    VehicleFuel,
    VehicleFuelConsumption,
    VehicleSpeedLimits,
    VehicleTanks,
    VehicleType
} from '~/types/vehicle';
import {
    COMPANIES,
    COUNTRIES,
    ROUTE_OPTIONS,
    DEFAULT_ADDRESS,
    DEFAULT_UPDATED_AGO,
    generateVehicles,
    type Country
} from '~/mocks/vehicles';

/** A catalog value paired with its i18n label key */
export interface VehicleOption<T extends string = string> {
    value: T;
    labelKey: string;
}

/** Fields needed to create a new vehicle; the composable fills the rest */
export interface AddVehicleInput {
    name: string;
    company: string;
    brand: string;
    model: string;
    year?: number;
    vin?: string;
    type: VehicleType;
    fuel?: VehicleFuel[];
    condition?: VehicleCondition;
    country?: string;
    regAddress?: string;
    driverId?: string;
    routes?: string[];
    trackerImei?: string;
    groupIds?: string[];
    carrier: boolean;
    seats?: number;
    comment?: string;
    odometer?: number;
    odometerDate?: string;
    engineHours?: number;
    engineHoursDate?: string;
    fuelConsumption?: VehicleFuelConsumption;
    tanks?: VehicleTanks;
    speedLimits?: VehicleSpeedLimits;
}

/** Input for updating an existing vehicle by id */
export interface UpdateVehicleInput extends AddVehicleInput {
    id: string;
}

/** Return type of the {@link useVehicles} composable */
export interface UseVehiclesReturn {
    /** Shared, reactive list of vehicles */
    vehicles: Ref<Vehicle[]>;
    /** Distinct company names (for filters and the form) */
    companies: string[];
    /** Vehicle types with i18n label keys */
    types: VehicleOption<VehicleType>[];
    /** Fuel kinds with i18n label keys */
    fuels: VehicleOption<VehicleFuel>[];
    /** Vehicle conditions with i18n label keys */
    conditions: VehicleOption<VehicleCondition>[];
    /** Country catalog (code + labelKey + flag icon) */
    countries: Country[];
    /** Route name catalog (for the form multiselect) */
    routeOptions: string[];
    /** Prepends a new vehicle to the list */
    addVehicle: (input: AddVehicleInput) => void;
    /** Updates an existing vehicle by id */
    updateVehicle: (input: UpdateVehicleInput) => void;
    /** Removes a vehicle from the list by id */
    deleteVehicle: (id: string) => void;
}

/** Vehicle types paired with their i18n label keys */
const VEHICLE_TYPES: VehicleOption<VehicleType>[] = [
    { value: 'car', labelKey: 'objects.vehicles.types.car' },
    { value: 'minibus', labelKey: 'objects.vehicles.types.minibus' },
    { value: 'truck', labelKey: 'objects.vehicles.types.truck' },
    { value: 'motorcycle', labelKey: 'objects.vehicles.types.motorcycle' },
    { value: 'bus', labelKey: 'objects.vehicles.types.bus' },
    { value: 'trailer', labelKey: 'objects.vehicles.types.trailer' }
];

/** Fuel kinds paired with their i18n label keys */
const VEHICLE_FUELS: VehicleOption<VehicleFuel>[] = [
    { value: 'petrol', labelKey: 'objects.vehicles.fuels.petrol' },
    { value: 'diesel', labelKey: 'objects.vehicles.fuels.diesel' },
    { value: 'gas', labelKey: 'objects.vehicles.fuels.gas' },
    { value: 'electric', labelKey: 'objects.vehicles.fuels.electric' }
];

/** Vehicle conditions paired with their i18n label keys */
const VEHICLE_CONDITIONS: VehicleOption<VehicleCondition>[] = [
    { value: 'active', labelKey: 'objects.vehicles.conditions.active' },
    { value: 'repair', labelKey: 'objects.vehicles.conditions.repair' },
    { value: 'inactive', labelKey: 'objects.vehicles.conditions.inactive' }
];

/**
 * Provides the (mock) list of vehicles, shared across the app via useState.
 * Filter / pagination / sorting are handled at the consumer level.
 * @returns {UseVehiclesReturn} Composable
 */
export const useVehicles = (): UseVehiclesReturn => {
    const vehicles = useState<Vehicle[]>('vehicles', () => generateVehicles());

    /** Prepends a new vehicle with computed id and default telemetry. */
    const addVehicle = (input: AddVehicleInput): void => {
        const nextId =
            Math.max(0, ...vehicles.value.map((v) => Number(v.id) || 0)) + 1;
        const newVehicle: Vehicle = {
            ...input,
            id: String(nextId),
            motionStatus: 'offline',
            address: input.regAddress?.trim() || DEFAULT_ADDRESS,
            updatedAgo: DEFAULT_UPDATED_AGO
        };
        vehicles.value = [newVehicle, ...vehicles.value];
    };

    /** Replaces an existing vehicle by id, preserving live telemetry fields. */
    const updateVehicle = (input: UpdateVehicleInput): void => {
        const idx = vehicles.value.findIndex((v) => v.id === input.id);
        if (idx === -1) return;
        const updated: Vehicle = {
            ...(vehicles.value[idx] as Vehicle),
            ...input
        };
        vehicles.value = [
            ...vehicles.value.slice(0, idx),
            updated,
            ...vehicles.value.slice(idx + 1)
        ];
    };

    /** Removes the vehicle with the given id, if present. */
    const deleteVehicle = (id: string): void => {
        vehicles.value = vehicles.value.filter((v) => v.id !== id);
    };

    return {
        vehicles,
        companies: COMPANIES,
        types: VEHICLE_TYPES,
        fuels: VEHICLE_FUELS,
        conditions: VEHICLE_CONDITIONS,
        countries: COUNTRIES,
        routeOptions: ROUTE_OPTIONS,
        addVehicle,
        updateVehicle,
        deleteVehicle
    };
};
