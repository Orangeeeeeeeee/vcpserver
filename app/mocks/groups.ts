import type {
    Group,
    GroupColor,
    GroupVehicle,
    GroupVehicleType
} from '~/types/group';

/** Mock company catalog (groups domain) */
export const COMPANIES = ['Logistics UA', 'CityBus Group', '1 UA', 'Logistics'];

const TRANSPORT_MODELS = [
    'MAN TGX 18.480',
    'Volvo FH 460',
    'Scania R 500',
    'Mercedes Actros',
    'DAF XF 480',
    'Iveco Stralis'
];

/** Available group accent colors (the form swatches, in display order) */
export const GROUP_COLORS: GroupColor[] = [
    'indigo',
    'teal',
    'violet',
    'sky',
    'rose',
    'amber'
];

/** Vehicle kind per transport model, so card and form icons always agree */
export const VEHICLE_TYPE_BY_MODEL: Record<string, GroupVehicleType> = {
    'MAN TGX 18.480': 'truck',
    'Volvo FH 460': 'truck',
    'Scania R 500': 'bus',
    'Mercedes Actros': 'bus',
    'DAF XF 480': 'van',
    'Iveco Stralis': 'van'
};

/**
 * Resolves the vehicle kind for a transport model.
 * @param model - Transport model name
 * @returns Vehicle kind; falls back to "truck" for unknown models
 */
export const vehicleTypeOf = (model: string): GroupVehicleType =>
    VEHICLE_TYPE_BY_MODEL[model] ?? 'truck';

/** Seed group names cycled across mock groups */
const GROUP_NAMES = [
    'Вантажні перевезення',
    'Міські автобуси',
    'Міжнародні рейси',
    "Кур'єрська доставка",
    'Рефрижератори',
    'Нічні рейси',
    'Регіональні маршрути',
    'Службовий транспорт'
];

/** Seed comments cycled across mock groups (long enough to clamp) */
const COMMENTS = [
    'Група обʼєднує транспортні засоби, що використовуються для виконання регулярних маршрутів між обласними центрами та логістичними хабами компанії.',
    'Маршрути для перевезення негабаритних вантажів, що потребують попереднього узгодження з дорожніми службами та спеціального супроводу.',
    'Транспорт для щоденних міських перевезень пасажирів. Працює у дві зміни з підміною на час технічного обслуговування.',
    'Рейси до країн ЄС з дотриманням режимів праці та відпочинку водіїв. Усі транспортні засоби обладнані тахографами.',
    'Перевезення товарів, що швидко псуються, з підтриманням температурного режиму від -20 до +5 градусів на всьому маршруті.',
    'Резервна група для пікових навантажень та заміни основного транспорту під час планових ремонтів і сезонних кампаній.'
];

/**
 * Builds the ordered vehicle list for the mock group at the given index.
 * Vehicles reference real trackers (`TRK-${112 + j}` over 80 trackers) so the
 * edit form pre-selects matching MultiSelect options.
 */
const vehiclesOf = (i: number): GroupVehicle[] => {
    const count = 2 + (i % 5);
    return Array.from({ length: count }, (_, k) => {
        const j = (i * 3 + k) % 80;
        const transport = TRANSPORT_MODELS[
            j % TRANSPORT_MODELS.length
        ] as string;
        return {
            transport,
            transportId: `TRK-${112 + j}`,
            type: vehicleTypeOf(transport)
        };
    });
};

/**
 * Generates 64 mock groups spread across statuses, companies and colors.
 * @returns Mock group list for the shared `useGroups` state
 */
export const generateGroups = (): Group[] => {
    return Array.from({ length: 64 }, (_, i) => ({
        id: String(i + 1),
        name: `${GROUP_NAMES[i % GROUP_NAMES.length]} ${Math.floor(i / GROUP_NAMES.length) + 1}`,
        company: COMPANIES[i % COMPANIES.length] as string,
        status: i % 4 === 3 ? 'inactive' : 'active',
        // bijective permutation (gcd(7, 64) = 1) so order differs from insertion
        order: ((i * 7) % 64) + 1,
        comment: COMMENTS[i % COMMENTS.length] as string,
        color: GROUP_COLORS[i % GROUP_COLORS.length] as GroupColor,
        vehicles: vehiclesOf(i)
    }));
};
