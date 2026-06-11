import type {
    Vehicle,
    VehicleCondition,
    VehicleMotionStatus,
    VehicleType
} from '~/types/vehicle';

/** Mock company catalog (vehicles domain) */
export const COMPANIES = ['Logistics UA', 'CityBus Group', '1 UA', 'Logistics'];

/** 2-letter avatar badges per company name */
export const COMPANY_BADGES: Record<string, string> = {
    'Logistics UA': 'LG',
    'CityBus Group': 'CB',
    '1 UA': '1U',
    Logistics: 'LO'
};

/** Brand/model split of the shared transport catalog */
const MODELS: { brand: string; model: string; type: VehicleType }[] = [
    { brand: 'MAN', model: 'TGX 18.480', type: 'truck' },
    { brand: 'Volvo', model: 'FH 460', type: 'truck' },
    { brand: 'Scania', model: 'R 500', type: 'bus' },
    { brand: 'Mercedes', model: 'Actros', type: 'bus' },
    { brand: 'DAF', model: 'XF 480', type: 'minibus' },
    { brand: 'Iveco', model: 'Stralis', type: 'minibus' }
];

/** Country option: code + i18n label key + `custom:` flag icon */
export interface Country {
    value: string;
    labelKey: string;
    flag: string;
}

/** Country catalog for the vehicle form */
export const COUNTRIES: Country[] = [
    { value: 'UA', labelKey: 'objects.vehicles.countries.UA', flag: 'custom:ua' },
    { value: 'PL', labelKey: 'objects.vehicles.countries.PL', flag: 'custom:pl' },
    { value: 'DE', labelKey: 'objects.vehicles.countries.DE', flag: 'custom:de' },
    { value: 'CZ', labelKey: 'objects.vehicles.countries.CZ', flag: 'custom:cz' },
    { value: 'MD', labelKey: 'objects.vehicles.countries.MD', flag: 'custom:md' }
];

/** Mock route catalog (for the form multiselect) */
export const ROUTE_OPTIONS = [
    'Київ — Львів',
    'Київ — Одеса',
    'Львів — Варшава',
    'Київ — Харків',
    'Одеса — Кишинів',
    'Київ — Дніпро'
];

/** Seed addresses cycled across mock vehicles */
const ADDRESSES = [
    'вул. Братиславська, 14, Київ, Україна',
    'просп. Свободи, 28, Львів, Україна',
    'вул. Дерибасівська, 5, Одеса, Україна',
    'вул. Сумська, 72, Харків, Україна'
];

/** Seed "updated ago" labels cycled across mock vehicles */
const UPDATED_AGO = ['23 хв тому', '5 хв тому', '1 год тому', 'Щойно'];

/** Address assigned to newly created vehicles (no live telemetry in mock) */
export const DEFAULT_ADDRESS = ADDRESSES[0] as string;

/** "Updated ago" label assigned to newly created vehicles */
export const DEFAULT_UPDATED_AGO = 'Щойно';

/**
 * Picks a motion status by index so every 9-row page mirrors the mockup
 * (a moving cluster, a couple of idle rows, one stopped, two offline).
 */
const motionStatusByIndex = (i: number): VehicleMotionStatus => {
    const r = i % 9;
    if (r === 2 || r === 6) return 'idle';
    if (r === 3) return 'stopped';
    if (r === 4 || r === 8) return 'offline';
    return 'moving';
};

/** Picks a condition by index (~70% active with repair/inactive sprinkled in) */
const conditionByIndex = (i: number): VehicleCondition => {
    if (i % 5 === 4) return 'repair';
    if (i % 7 === 6) return 'inactive';
    return 'active';
};

/**
 * Generates 72 mock vehicles (8 pages × 9 rows). Vehicle ids/names, driver
 * ids, tracker IMEIs and group ids reference the sibling mock domains so the
 * edit form pre-selects real options.
 * @returns Mock vehicle list for the shared `useVehicles` state
 */
export const generateVehicles = (): Vehicle[] => {
    return Array.from({ length: 72 }, (_, i) => {
        const spec = MODELS[i % MODELS.length] as (typeof MODELS)[number];
        const carrier = i % 3 !== 2;
        return {
            id: String(i + 1),
            name: `TRK-${112 + i}`,
            company: COMPANIES[i % COMPANIES.length] as string,
            brand: spec.brand,
            model: spec.model,
            year: 2014 + (i % 11),
            vin: `WMA${String(10000000000000 + i * 7919).slice(0, 14)}`,
            type: spec.type,
            fuel: i % 6 === 5 ? 'petrol' : 'diesel',
            condition: conditionByIndex(i),
            country: COUNTRIES[i % COUNTRIES.length]?.value,
            regAddress: ADDRESSES[i % ADDRESSES.length] as string,
            driverId: String(1 + (i % 64)),
            routes: [ROUTE_OPTIONS[i % ROUTE_OPTIONS.length] as string],
            trackerImei: String(352094083412587 + i),
            groupIds: [String(1 + (i % 64))],
            carrier,
            seats: carrier ? 20 + (i % 35) : undefined,
            comment:
                i % 4 === 0
                    ? 'Закріплений за регулярним маршрутом. Проходить ТО за графіком.'
                    : undefined,
            odometer: 120000 + i * 1573,
            odometerDate: `${String(1 + (i % 28)).padStart(2, '0')}.${String(1 + (i % 12)).padStart(2, '0')}.2025`,
            engineHours: 3200 + i * 41,
            engineHoursDate: `${String(1 + (i % 28)).padStart(2, '0')}.${String(1 + (i % 12)).padStart(2, '0')}.2025`,
            fuelConsumption: {
                average: 28 + (i % 6),
                slow: 24 + (i % 4),
                normal: 28 + (i % 5),
                fast: 33 + (i % 7)
            },
            tanks: { main: 400 + (i % 4) * 50, extra: i % 2 === 0 ? 200 : undefined },
            speedLimits: { normal: 80, max: 90 + (i % 3) * 5 },
            motionStatus: motionStatusByIndex(i),
            address: ADDRESSES[i % ADDRESSES.length] as string,
            updatedAgo: UPDATED_AGO[i % UPDATED_AGO.length] as string
        };
    });
};
