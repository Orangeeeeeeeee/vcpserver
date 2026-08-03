import type {
    PassengerFlowAmountEntry,
    PassengerFlowRecord,
    PassengerFlowTrip,
    PassengerFlowTripStop
} from '~/types/passenger-flow';
import type { PassengerFlowDataPoint } from '~/components/passenger-flow/PassengerFlowChart.vue';
import { DEMO_MEDIA_SOURCES, type DemoMediaSource } from '~/mocks/demo-media';

/** Transport models cycled across mock records */
const TRANSPORT_MODELS = [
    'MAN TGX 18.480',
    'Volvo FH 460',
    'Scania R 500',
    'Mercedes Actros',
    'DAF XF 480',
    'Iveco Stralis'
];

/** Group names shown as table tags */
export const GROUPS = ['Logistics', 'CityBus', 'Express UA', 'Cargo'];

/** Driver names cycled across mock records */
const DRIVERS = [
    'Тарас Прошко',
    'Олена Коваль',
    'Михайло Іщенко',
    'Юлія Бондар',
    'Андрій Бойко',
    'Тетяна Мельник',
    'Ігор Кравченко',
    'Сергій Поліщук'
];

/**
 * Generates 72 mock passenger flow records (8 pages of 9 rows).
 * Values are deterministic so SSR and client render the same data.
 * @returns Mock passenger flow record list
 */
export const generatePassengerFlowRecords = (): PassengerFlowRecord[] => {
    return Array.from({ length: 72 }, (_, i) => ({
        id: String(i + 1),
        transport: TRANSPORT_MODELS[i % TRANSPORT_MODELS.length] as string,
        transportId: `TRK-${112 + i}`,
        group: GROUPS[i % GROUPS.length] as string,
        driver: DRIVERS[i % DRIVERS.length] as string,
        trips: 5 + ((i * 7) % 25),
        distance: 180 + ((i * 37) % 640),
        passengers: 30 + ((i * 53) % 220),
        profit: 250 + ((i * 91) % 950)
    }));
};

/** Cities used as trip route endpoints */
const LOCATIONS = [
    'Київ',
    'Львів',
    'Одеса',
    'Харків',
    'Дніпро',
    'Вінниця',
    'Полтава',
    'Чернігів'
];

/** Full departure addresses used as trip route start points, aligned with {@link LOCATIONS} */
const ADDRESSES = [
    'м. Київ, вул. Перемоги, 1',
    'м. Львів, вул. Шевченка, 12',
    'м. Одеса, вул. Дерибасівська, 5',
    'м. Харків, вул. Сумська, 8',
    'м. Дніпро, просп. Яворницького, 22',
    'м. Вінниця, вул. Соборна, 17',
    'м. Полтава, вул. Соборності, 3',
    'м. Чернігів, просп. Миру, 14'
];

/** Foreign destination cities used to vary trip endpoints */
const DESTINATIONS = [
    'Варшава',
    'Прага',
    'Берлін',
    'Відень',
    'Будапешт',
    'Бухарест'
];

/**
 * Generates 12 mock trips for the given transport.
 * Values are deterministic so SSR and client render the same data.
 * @param transportId - Id of the transport the trips belong to
 * @returns Mock trip list
 */
export const generatePassengerFlowTrips = (
    transportId: string
): PassengerFlowTrip[] => {
    return Array.from({ length: 12 }, (_, i) => {
        const from = ADDRESSES[i % ADDRESSES.length] as string;
        const to = DESTINATIONS[i % DESTINATIONS.length] as string;
        const day = 1 + (i % 28);
        const date = `2026-06-${String(day).padStart(2, '0')}`;
        const passengers = 20 + ((i * 13) % 80);
        const pricePerPassenger = 25 + ((i * 5) % 30);

        return {
            id: `TRP-${transportId}-${i + 1}`,
            transportId,
            departureAt: `${date} 0${6 + (i % 4)}:00`,
            arrivalAt: `${date} ${12 + (i % 6)}:30`,
            fromLocation: from,
            toLocation: to,
            duration: `${4 + (i % 6)} ${pluralizeUa(4 + (i % 6), 'година', 'години', 'годин')}`,
            distance: 120 + ((i * 37) % 480),
            pointsCount: 4 + (i % 4),
            passengers,
            pricePerPassenger,
            profit: Math.round(passengers * pricePerPassenger * 10) / 10
        };
    });
};

/**
 * Generates mock stop points for the given trip.
 * Values are deterministic so SSR and client render the same data.
 * @param tripId - Id of the trip the stops belong to
 * @param pointsCount - Number of stops to generate
 * @returns Mock trip stop list
 */
export const generatePassengerFlowTripStops = (
    tripId: string,
    pointsCount: number
): PassengerFlowTripStop[] => {
    return Array.from({ length: pointsCount }, (_, i) => {
        const boarded = 2 + ((i * 5) % 12);
        const alighted = 1 + ((i * 3) % 10);
        const price = 25 + ((i * 5) % 30);

        const amountBreakdown: PassengerFlowAmountEntry[] = [];
        if (i % 2 === 1 && boarded > 1) {
            const count1 = Math.ceil(boarded / 2);
            const count2 = boarded - count1;
            const price2 = price + 10 + ((i * 7) % 15);
            amountBreakdown.push(
                {
                    count: count1,
                    price,
                    total: Math.round(count1 * price * 10) / 10
                },
                {
                    count: count2,
                    price: price2,
                    total: Math.round(count2 * price2 * 10) / 10,
                    location: LOCATIONS[(i + 1) % LOCATIONS.length] as string
                }
            );
        } else {
            amountBreakdown.push({
                count: boarded,
                price,
                total: Math.round(boarded * price * 10) / 10
            });
        }

        return {
            id: `${tripId}-STOP-${i + 1}`,
            departureTime: `2026-06-01 0${6 + i}:${String((i * 15) % 60).padStart(2, '0')}`,
            zone: LOCATIONS[i % LOCATIONS.length] as string,
            distance: 10 + ((i * 9) % 60),
            passengers: 15 + ((i * 11) % 50),
            boarded,
            alighted,
            amountBreakdown,
            amount:
                Math.round(
                    amountBreakdown.reduce(
                        (sum, entry) => sum + entry.total,
                        0
                    ) * 10
                ) / 10,
            photo: (
                DEMO_MEDIA_SOURCES[
                    i % DEMO_MEDIA_SOURCES.length
                ] as DemoMediaSource
            ).posterUrl,
            videoUrl: (
                DEMO_MEDIA_SOURCES[
                    i % DEMO_MEDIA_SOURCES.length
                ] as DemoMediaSource
            ).streamUrl
        };
    });
};

/** Dates used as x-axis categories for transport chart series */
const CHART_DATES = [
    '01.03',
    '08.03',
    '16.03',
    '24.03',
    '28.03',
    '31.03',
    '01.04'
];

/**
 * Generates a deterministic weekly data series oscillating around a base value.
 * Values are derived from the transport id so each transport gets a distinct, stable series.
 * @param base - Target (latest) value the series ends at
 * @param transportId - Id of the transport, used to vary the series shape
 * @returns Data points for {@link PassengerFlowChart}
 */
export const generatePassengerFlowSeries = (
    base: number,
    transportId: string
): PassengerFlowDataPoint[] => {
    const seed = transportId
        .split('')
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return CHART_DATES.map((date, i) => {
        const variance = ((seed + i * 17) % 21) - 10;
        const value = Math.max(0, Math.round(base * (1 + variance / 100)));
        return { date, count: i === CHART_DATES.length - 1 ? base : value };
    });
};
