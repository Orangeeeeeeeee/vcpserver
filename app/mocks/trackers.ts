import type { Tracker } from '~/types/tracker';

/** Mock company catalog (trackers domain) */
export const COMPANIES = ['Logistics UA', 'CityBus Group', '1 UA', 'Logistics'];

/** 2-letter avatar badges per company name */
export const COMPANY_BADGES: Record<string, string> = {
    'Logistics UA': 'LG',
    'CityBus Group': 'CB',
    '1 UA': '1U',
    Logistics: 'LO'
};

/** Mock transport model catalog (for the tracker form) */
export const TRANSPORT_MODELS = [
    'MAN TGX 18.480',
    'Volvo FH 460',
    'Scania R 500',
    'Mercedes Actros',
    'DAF XF 480',
    'Iveco Stralis'
];

/** Mock sensor parameter catalog (for the tracker form multiselect) */
export const TRACKER_PARAMS = [
    'Швидкість',
    'Температура двигуна',
    'Рівень палива',
    'Пробіг',
    'Координати GPS',
    'Стан запалювання',
    'Напруга акумулятора'
];

/**
 * Generates roughly 80 mock trackers for the table (pagination demo).
 * @returns Mock tracker list for the shared `useTrackers` state
 */
export const generateTrackers = (): Tracker[] => {
    return Array.from({ length: 80 }, (_, i) => {
        const company = COMPANIES[i % COMPANIES.length] as string;
        const transport = TRANSPORT_MODELS[
            i % TRANSPORT_MODELS.length
        ] as string;
        const paramsCount = 1 + (i % TRACKER_PARAMS.length);
        return {
            id: String(i + 1),
            company,
            companyBadge:
                COMPANY_BADGES[company] ?? company.slice(0, 2).toUpperCase(),
            imei: String(352094083412587 + i),
            port: 5023 + (i % 12),
            transport,
            transportId: `TRK-${112 + i}`,
            params: TRACKER_PARAMS.slice(0, paramsCount)
        };
    });
};
