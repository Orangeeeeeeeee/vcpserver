import type { PassengerFlowRecord } from '~/types/passenger-flow';

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
const GROUPS = ['Logistics', 'CityBus', 'Express UA', 'Cargo'];

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
