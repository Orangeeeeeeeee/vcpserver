import { haversineKm } from '~/utils/geo';
import type { Route, RouteCoords, RoutePoint } from '~/types/route';

/** An entry of the mock address catalog behind the address autocomplete */
export interface MockRouteAddress {
    /** Display address, e.g. "Київ, вул. Хрещатик, 1" */
    label: string;
    /** Address location as [lat, lng] */
    coords: RouteCoords;
}

/**
 * Static address catalog used instead of a geocoding API: it feeds the
 * address autocomplete of the route points and the reverse lookup of the
 * pick-on-map mode. Removed once a real geocoder is wired in.
 */
export const mockRouteAddresses: MockRouteAddress[] = [
    { label: 'Київ, вул. Хрещатик, 1', coords: [50.4489, 30.5232] },
    { label: 'Київ, вул. Хрещатик, 2', coords: [50.4478, 30.5222] },
    { label: 'Київ, вул. Хрещатик, 3', coords: [50.4501, 30.5241] },
    { label: 'Київ, вул. Хрещатик, 4', coords: [50.4468, 30.5213] },
    { label: 'Бровари, вул. Незалежності, 2', coords: [50.5111, 30.7909] },
    { label: 'Ірпінь, вул. Соборна, 1', coords: [50.5218, 30.2506] },
    { label: 'Васильків, вул. Соборна, 42', coords: [50.1774, 30.3134] },
    { label: 'Обухів, вул. Київська, 1', coords: [50.1072, 30.6211] },
    { label: 'Житомир, майдан Соборний, 1', coords: [50.2547, 28.6587] },
    { label: 'Вінниця, вул. Соборна, 59', coords: [49.2328, 28.4682] },
    { label: 'Львів, пл. Ринок, 1', coords: [49.8419, 24.0316] },
    { label: 'Одеса, вул. Дерибасівська, 1', coords: [46.4843, 30.7323] },
    { label: 'Дніпро, просп. Яворницького, 1', coords: [48.4647, 35.0462] },
    { label: 'Харків, майдан Свободи, 1', coords: [49.9935, 36.2304] },
    { label: 'Полтава, вул. Соборності, 1', coords: [49.5883, 34.5514] },
    { label: 'Черкаси, бул. Шевченка, 1', coords: [49.4444, 32.0598] }
];

/**
 * Finds the catalog address closest to the given location (the mock reverse
 * geocoder of the pick-on-map mode).
 * @param coords - Picked location as [lat, lng].
 * @param maxKm - Match radius in kilometers.
 * @returns {MockRouteAddress | null} The closest address within the radius.
 */
export const nearestMockAddress = (
    coords: RouteCoords,
    maxKm: number
): MockRouteAddress | null => {
    let best: MockRouteAddress | null = null;
    let bestKm = maxKm;
    for (const address of mockRouteAddresses) {
        const km = haversineKm(coords, address.coords);
        if (km <= bestKm) {
            best = address;
            bestKm = km;
        }
    }
    return best;
};

/** Catalog index chains the mock routes are built from (start → finish) */
const POINT_CHAINS: number[][] = [
    [0, 8, 9, 10], // Київ — Житомир — Вінниця — Львів
    [0, 4, 5, 6, 7], // Київ — Бровари — Ірпінь — Васильків — Обухів
    [0, 14, 12], // Київ — Полтава — Дніпро
    [0, 15, 11], // Київ — Черкаси — Одеса
    [10, 9, 0], // Львів — Вінниця — Київ
    [13, 14, 0] // Харків — Полтава — Київ
];

/** Companies cycled across the mock routes */
const ROUTE_COMPANIES = ['Logistics UA', 'CityBus Group', '1 UA', 'Logistics'];

/** City part of a catalog address, e.g. "Київ" of "Київ, вул. Хрещатик, 1" */
const cityOf = (label: string): string => label.split(',')[0] ?? label;

/**
 * Builds the ordered points of a mock route from a catalog index chain.
 * Intermediates alternate between checkpoints and stops so the edit modal
 * shows both «Контрольна точка» and «Зупинка» rows.
 * @param routeIndex - Index of the route (id source of the points).
 * @param chain - Catalog indexes ordered start → finish.
 * @returns {RoutePoint[]} Ordered route points.
 */
const chainToPoints = (routeIndex: number, chain: number[]): RoutePoint[] =>
    chain.map((catalogIndex, i) => {
        const entry = mockRouteAddresses[catalogIndex] as MockRouteAddress;
        const kind: RoutePoint['kind'] =
            i === 0
                ? 'start'
                : i === chain.length - 1
                  ? 'finish'
                  : 'intermediate';
        return {
            id: `r${routeIndex}-p${i + 1}`,
            kind,
            address: entry.label,
            coords: [...entry.coords] as RouteCoords,
            name: cityOf(entry.label),
            type:
                kind === 'intermediate'
                    ? i % 2 === 1
                        ? 'checkpoint'
                        : 'stop'
                    : null,
            radius: 50,
            directPath: false,
            timeToPoint: i === 0 ? null : `0${1 + ((routeIndex + i) % 4)}:10`
        };
    });

/**
 * Intercity fares for every forward pair of the given points, keyed
 * "{fromPointId}-{toPointId}".
 * @param points - Ordered route points.
 * @returns {Record<string, number>} Mock segment prices.
 */
const chainSegmentPrices = (points: RoutePoint[]): Record<string, number> => {
    const prices: Record<string, number> = {};
    for (let i = 0; i < points.length - 1; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const from = points[i] as RoutePoint;
            const to = points[j] as RoutePoint;
            prices[`${from.id}-${to.id}`] = 60 + (j - i) * 55;
        }
    }
    return prices;
};

/**
 * Builds the deterministic mock route list behind the «Регулярні маршрути»
 * and «Заплановані маршрути» pages. Replaced by the real API later.
 * @returns {Route[]} Mock routes (both regular and scheduled).
 */
export const generateRoutes = (): Route[] =>
    Array.from({ length: 48 }, (_, i) => {
        const chain = POINT_CHAINS[i % POINT_CHAINS.length] as number[];
        const points = chainToPoints(i + 1, chain);
        const start = points[0] as RoutePoint;
        const finish = points[points.length - 1] as RoutePoint;
        const scheduled = i % 2 === 1;
        const passenger = i % 3 !== 2;
        const intercity = passenger && i % 4 === 0;
        const manyVehicles = i % 6 === 4;
        return {
            id: String(i + 1),
            companies: [ROUTE_COMPANIES[i % ROUTE_COMPANIES.length] as string],
            name: `${cityOf(start.address)} — ${cityOf(finish.address)}`,
            status: i % 5 === 2 ? 'inactive' : 'active',
            scheduled,
            startAt: scheduled
                ? new Date(
                      2026,
                      2 + (i % 6),
                      1 + (i % 28),
                      6 + (i % 12),
                      0
                  ).toISOString()
                : null,
            errorCount: i % 4 === 0 ? 3 : null,
            passenger,
            intercity,
            reverseCalculation: false,
            singlePrice: passenger && !intercity ? 150 + (i % 5) * 25 : null,
            segmentPrices: intercity ? chainSegmentPrices(points) : {},
            points,
            vehicleIds: manyVehicles
                ? Array.from({ length: 5 }, (_, v) =>
                      String(1 + ((i + v) % 72))
                  )
                : [String(1 + (i % 72))],
            driverIds: [String(1 + (i % 64))],
            groupIds: Array.from({ length: 3 }, (_, g) =>
                String(1 + ((i + g * 21) % 64))
            )
        } satisfies Route;
    });
