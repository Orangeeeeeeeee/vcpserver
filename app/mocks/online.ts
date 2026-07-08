import type {
    OnlineDetailEntry,
    OnlineGroup,
    OnlineStatus,
    OnlineVehicle,
    OnlineVehicleDetail,
    VehicleCamera
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
/** Formats minutes as "HH:MM" */
const asTime = (minutes: number): string =>
    `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/**
 * Generates the deterministic detail sections (day stats, telemetry,
 * additional data, cameras) for one online vehicle. Telemetry/additional
 * labels are intentionally raw parameter names, the way a device API
 * reports them, and are not translated.
 * @param {OnlineVehicle} vehicle Base online record the detail belongs to.
 * @returns {OnlineVehicleDetail} Mock detail sections for the vehicle page.
 */
export const generateOnlineVehicleDetail = (
    vehicle: OnlineVehicle
): OnlineVehicleDetail => {
    /** Numeric seed derived from the "on-N" id */
    const seed = Number(vehicle.id.replace(/\D/g, '')) || 1;
    const moving = vehicle.speed > 0;

    const telemetry: OnlineDetailEntry[] = [
        { label: 'ICCID1', value: String(8937202012345678901n + BigInt(seed)) },
        { label: 'Satellites', value: String(8 + (seed % 7)) },
        { label: 'Network Type', value: seed % 3 === 0 ? 'LTE' : '3G' },
        { label: 'Active GSM Operator', value: String(25501 + (seed % 3)) },
        {
            label: 'GNSS Status',
            value: seed % 5 === 0 ? 'GNSS OFF' : 'GNSS ON'
        },
        { label: 'Speed', value: `${vehicle.speed} km/h` },
        { label: 'Movement', value: moving ? 'On' : 'Off' },
        { label: 'Instant Movement', value: moving ? 'On' : 'Off' },
        {
            label: 'Ignition',
            value: vehicle.status === 'stopped' ? 'Off' : 'On'
        },
        { label: 'External Voltage', value: `${12 + (seed % 3) * 0.4} V` },
        { label: 'Engine Temperature', value: `${82 + (seed % 12)} °C` },
        { label: 'Fuel Level', value: `${40 + ((seed * 7) % 45)} l` },
        { label: 'LLS 1 Fuel Level', value: `${20 + ((seed * 11) % 40)} l` },
        { label: 'Dallas Temperature 1', value: `${70 + (seed % 15)} °C` },
        {
            label: 'Dallas Temperature ID 1',
            value: `28FF641D62150${String(37 + seed).padStart(2, '0')}A`
        }
    ];

    const additional: OnlineDetailEntry[] = [
        {
            label: 'VIN-код',
            value: `1HGCM82633A00${String(4000 + seed * 87).slice(0, 4)}`
        },
        { label: 'Тип пального', value: seed % 6 === 5 ? 'Бензин' : 'Дизель' },
        { label: 'Стан', value: 'Активний' },
        ...Array.from({ length: 4 }, (_, k) => ({
            label: `Параметр ${k + 1}`,
            value: 'Значення'
        }))
    ];

    /** Every vehicle carries 2–3 onboard cameras in the mock fleet */
    const cameras: VehicleCamera[] = Array.from(
        { length: 2 + (seed % 2) },
        (_, k) => ({
            id: `${vehicle.id}-cam-${k + 1}`,
            number: k + 1
        })
    );

    const departure = 7 * 60 + ((seed * 13) % 120);

    return {
        stats: {
            ignitionTime: asTime(3 * 60 + ((seed * 17) % 180)),
            idleTime: asTime(30 + ((seed * 23) % 90)),
            departureTime: asTime(departure),
            // vehicles still on route (moving) have no arrival time yet
            arrivalTime: moving
                ? undefined
                : asTime(departure + 8 * 60 + ((seed * 29) % 120)),
            mileageKm: 60 + ((seed * 31) % 340),
            maxSpeed: 72 + ((seed * 19) % 40)
        },
        telemetry,
        additional,
        cameras
    };
};

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
