import type {
    OnlineGroup,
    OnlineStatus,
    OnlineVehicle
} from '~/types/online';

/** Mock online groups (panel sections; counts: 20 / 4 / 7) */
export const ONLINE_GROUPS: OnlineGroup[] = [
    {
        id: 'g1',
        name: 'Logistics UA',
        color: 'violet',
        description:
            'Міські та міжміські перевезення по західному регіону. Група включає автобуси та сервісні авто.'
    },
    { id: 'g2', name: 'Other Companies', color: 'amber' },
    { id: 'g3', name: 'Companies ABC', color: 'teal' }
];

const MODELS = [
    'Mercedes-Benz Sprinter 519 CDI',
    'MAN TGX 18.480',
    'Volvo FH 460',
    'Scania R 500',
    'DAF XF 480',
    'Iveco Stralis'
];

const DRIVERS = [
    'Василь Прийма',
    'Ігор Мельник',
    'Олена Коваль',
    'Андрій Бойко',
    'Тетяна Мельник',
    'Сергій Поліщук'
];

const ADDRESSES = [
    'вул. Братиславська, 14, Київ, Україна',
    'траса М06, 128 км, поблизу м. Житомир, Україна',
    'просп. Свободи, 28, Львів, Україна',
    'вул. Сумська, 72, Харків, Україна'
];

const UPDATED_AGO = ['2 хв тому', '5 хв тому', '23 хв тому', '1 год тому'];

const TYPE_KEYS = [
    'objects.vehicles.types.minibus',
    'objects.vehicles.types.truck',
    'objects.vehicles.types.bus'
];

/** Status mix so every group surfaces the legend variety */
const STATUSES: OnlineStatus[] = [
    'moving',
    'idleEngine',
    'moving',
    'stopped',
    'speeding',
    'moving',
    'warning',
    'moving',
    'speedingHard',
    'accident'
];

/** Anchor coordinates spread across Ukraine (jittered per vehicle) */
const COORDS: [number, number][] = [
    [51.29, 31.4], // Чернігівщина
    [50.9, 34.4], // Суми
    [49.59, 34.55], // Полтава
    [48.46, 35.04], // Дніпро
    [49.07, 33.42], // Кременчук
    [50.45, 30.52], // Київ
    [49.44, 32.06], // Черкаси
    [49.84, 24.03], // Львів
    [49.23, 28.47], // Вінниця
    [50.25, 28.66] // Житомир
];

/** Per-group vehicle counts (matches the mock badges 20 / 4 / 7) */
const GROUP_SIZES: Record<string, number> = { g1: 20, g2: 4, g3: 7 };

/**
 * Generates 31 mock online vehicles across the three groups, spread over
 * Ukraine with a deterministic jitter so markers don't overlap.
 * @returns Mock online fleet
 */
export const generateOnlineVehicles = (): OnlineVehicle[] => {
    const result: OnlineVehicle[] = [];
    let index = 0;

    for (const group of ONLINE_GROUPS) {
        const size = GROUP_SIZES[group.id] ?? 0;
        for (let k = 0; k < size; k++) {
            const i = index++;
            const [lat, lng] = COORDS[i % COORDS.length] as [number, number];
            const status = STATUSES[i % STATUSES.length] as OnlineStatus;
            const moving =
                status === 'moving' ||
                status === 'speeding' ||
                status === 'speedingHard';
            result.push({
                id: `on-${i + 1}`,
                groupId: group.id,
                name: MODELS[i % MODELS.length] as string,
                vehicleId: i % 2 === 0 ? `BUS-${47 + i}` : `TRK-${112 + i}`,
                status,
                speed: moving ? 58 + ((i * 7) % 40) : 0,
                updatedAgo: UPDATED_AGO[i % UPDATED_AGO.length] as string,
                imei: String(352094083412587 + i),
                address: ADDRESSES[i % ADDRESSES.length] as string,
                typeKey: TYPE_KEYS[i % TYPE_KEYS.length] as string,
                driver: DRIVERS[i % DRIVERS.length] as string,
                passenger: i % 4 === 1,
                comment:
                    i % 3 === 1
                        ? 'Магістральний тягач для міжнародних перевезень. Оснащений датчиком рівня пального.'
                        : undefined,
                // deterministic jitter ≈ ±0.35°, keeps markers apart
                lat: lat + (((i * 37) % 14) - 7) * 0.05,
                lng: lng + (((i * 53) % 16) - 8) * 0.055
            });
        }
    }

    return result;
};
