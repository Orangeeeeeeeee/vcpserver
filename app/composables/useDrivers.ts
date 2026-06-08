import type {
    Driver,
    DriverStatus,
    DriverLicense,
    DriverDocument
} from '~/components/objects/DriverCard.vue';

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

const COMPANIES = ['Logistics UA', 'CityBus Group', '1 UA', 'Logistics'];

const TRANSPORT_MODELS = [
    'MAN TGX 18.480',
    'Volvo FH 460',
    'Scania R 500',
    'Mercedes Actros',
    'DAF XF 480',
    'Iveco Stralis'
];

const NAMES = [
    'Василь Прийма',
    'Олена Коваль',
    'Михайло Іщенко',
    'Олександр Гриценко',
    'Юлія Бондар',
    'Андрій Бойко',
    'Тетяна Мельник',
    'Ігор Кравченко',
    'Наталія Шевченко',
    'Сергій Поліщук',
    'Ірина Лисенко',
    'Володимир Ткаченко',
    'Марія Савчук',
    'Дмитро Павленко',
    'Оксана Гаврилюк',
    'Роман Зінченко'
];

const EMPLOYMENT_TYPES = [
    'Повна зайнятість',
    'Часткова зайнятість',
    'Контракт'
];

const LICENSE_CATEGORIES = ['B', 'B, C', 'C', 'C, D', 'B, C, D, E'];

/** Single license categories for the form multiselect (model stores them joined) */
const LICENSE_CATEGORY_OPTIONS = ['A', 'B', 'C', 'D', 'E'];

/** Driver statuses paired with their i18n label keys */
const DRIVER_STATUSES: DriverStatusOption[] = [
    { value: 'active', labelKey: 'objects.drivers.card.statusActive' },
    { value: 'blocked', labelKey: 'objects.drivers.card.statusBlocked' },
    { value: 'vacation', labelKey: 'objects.drivers.card.statusVacation' },
    { value: 'unavailable', labelKey: 'objects.drivers.card.statusUnavailable' }
];

/** Returns 2-letter initials from a full Ukrainian name (e.g. "Василь Прийма" -> "ВП") */
const initialsOf = (name: string): string => {
    const parts = name.split(' ');
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts[1]?.charAt(0) ?? '';
    return (first + last).toUpperCase();
};

/** Pads a number to 2 digits */
const pad2 = (n: number): string => String(n).padStart(2, '0');

/**
 * Picks a status by index. Distributes so each 8-card page surfaces all
 * four statuses (≈63% active, 12-13% each of blocked/vacation/unavailable).
 */
const statusByIndex = (i: number): DriverStatus => {
    const r = i % 8;
    if (r === 2) return 'blocked';
    if (r === 4) return 'vacation';
    if (r === 6) return 'unavailable';
    return 'active';
};

/** Generates 64 mock drivers spread across statuses, companies, transports */
const generateDrivers = (): Driver[] => {
    return Array.from({ length: 64 }, (_, i) => {
        const name = NAMES[i % NAMES.length] as string;
        const company = COMPANIES[i % COMPANIES.length] as string;
        const transport = TRANSPORT_MODELS[
            i % TRANSPORT_MODELS.length
        ] as string;
        const employment = EMPLOYMENT_TYPES[
            i % EMPLOYMENT_TYPES.length
        ] as string;
        const categories = LICENSE_CATEGORIES[
            i % LICENSE_CATEGORIES.length
        ] as string;
        return {
            id: String(i + 1),
            name,
            initials: initialsOf(name),
            company,
            status: statusByIndex(i),
            transport,
            transportId: `TRK-${112 + i}`,
            phone: `+380 67 ${pad2(458 + (i % 500))} ${pad2(29 + (i % 70))} ${pad2(14 + (i % 80))}`,
            email: `driver${i + 1}@translogistics.ua`,
            license: {
                id: `DL-UA-${78451239 + i}`,
                expiresAt: `${pad2(1 + (i % 28))}.${pad2(1 + (i % 12))}.${2025 + (i % 5)}`,
                categories
            },
            startedAt: `${pad2(1 + (i % 28))}.${pad2(1 + (i % 12))}.${2018 + (i % 8)}`,
            employment
        };
    });
};

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
