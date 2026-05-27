import type {
    Driver,
    DriverStatus
} from '~/components/objects/DriverCard.vue';

/** Return type of the {@link useDrivers} composable */
export interface UseDriversReturn {
    /** Shared, reactive list of drivers */
    drivers: Ref<Driver[]>;
    /** Distinct company names (for the future filter dropdown) */
    companies: string[];
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
    return { drivers, companies: COMPANIES };
};
