import type {
    Driver,
    DriverStatus,
    DriverLicense,
    DriverDocument
} from '~/types/driver';
import {
    COMPANIES,
    EMPLOYMENT_TYPES,
    LICENSE_CATEGORY_OPTIONS,
    generateDrivers
} from '~/mocks/drivers';
import { initialsOf } from '~/utils/string';

/** A driver status paired with its i18n label key */
export interface DriverStatusOption {
    value: DriverStatus;
    labelKey: string;
}

/** Fields needed to create a new driver; the composable fills id/initials */
export interface AddDriverInput {
    name: string;
    status: DriverStatus;
    transport: string;
    transportId: string;
    company: string;
    phone: string;
    email: string;
    startedAt: string;
    employment: string;
    comment?: string;
    license: DriverLicense;
    documents?: DriverDocument[];
}

/** Input for updating an existing driver by id */
export interface UpdateDriverInput extends AddDriverInput {
    id: string;
}

/** Return type of the {@link useDrivers} composable */
export interface UseDriversReturn {
    /** Shared, reactive list of drivers */
    drivers: Ref<Driver[]>;
    /** Distinct company names (for the future filter dropdown) */
    companies: string[];
    /** Available employment types (for the driver form) */
    employmentTypes: string[];
    /** Available single license categories (for the driver form multiselect) */
    licenseCategories: string[];
    /** Available statuses with i18n label keys (for the driver form) */
    statuses: DriverStatusOption[];
    /** Prepends a new driver to the list */
    addDriver: (input: AddDriverInput) => void;
    /** Updates an existing driver by id */
    updateDriver: (input: UpdateDriverInput) => void;
    /** Removes a driver from the list by id */
    deleteDriver: (id: string) => void;
}

/** Driver statuses paired with their i18n label keys */
const DRIVER_STATUSES: DriverStatusOption[] = [
    { value: 'active', labelKey: 'objects.drivers.card.statusActive' },
    { value: 'blocked', labelKey: 'objects.drivers.card.statusBlocked' },
    { value: 'vacation', labelKey: 'objects.drivers.card.statusVacation' },
    { value: 'unavailable', labelKey: 'objects.drivers.card.statusUnavailable' }
];

/**
 * Provides the (mock) list of drivers, shared across the app via useState.
 * Filter / pagination are handled at the consumer level.
 * @returns {UseDriversReturn} Composable
 */
export const useDrivers = (): UseDriversReturn => {
    const drivers = useState<Driver[]>('drivers', () => generateDrivers());

    /** Prepends a new driver with a computed id and initials. */
    const addDriver = (input: AddDriverInput): void => {
        const nextId =
            Math.max(0, ...drivers.value.map((d) => Number(d.id) || 0)) + 1;
        const newDriver: Driver = {
            ...input,
            id: String(nextId),
            initials: initialsOf(input.name)
        };
        drivers.value = [newDriver, ...drivers.value];
    };

    /** Replaces an existing driver by id, recomputing initials. */
    const updateDriver = (input: UpdateDriverInput): void => {
        const idx = drivers.value.findIndex((d) => d.id === input.id);
        if (idx === -1) return;
        const updated: Driver = {
            ...(drivers.value[idx] as Driver),
            ...input,
            initials: initialsOf(input.name)
        };
        drivers.value = [
            ...drivers.value.slice(0, idx),
            updated,
            ...drivers.value.slice(idx + 1)
        ];
    };

    /** Removes the driver with the given id, if present. */
    const deleteDriver = (id: string): void => {
        drivers.value = drivers.value.filter((d) => d.id !== id);
    };

    return {
        drivers,
        companies: COMPANIES,
        employmentTypes: EMPLOYMENT_TYPES,
        licenseCategories: LICENSE_CATEGORY_OPTIONS,
        statuses: DRIVER_STATUSES,
        addDriver,
        updateDriver,
        deleteDriver
    };
};
