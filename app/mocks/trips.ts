import { routeDistanceKm, routeDurationMinutes } from '~/utils/routes';
import {
    generateRoutes,
    mockRouteAddresses,
    type MockRouteAddress
} from '~/mocks/routes';
import type { Trip, TripResource, TripResourceStatus } from '~/types/trip';

/** Resource progress multipliers cycled so every design state shows up
 * (including the >100% red progress bar) */
const PROGRESS_FACTORS = [0.3, 1.1, 0.5, 0.75];

/** Elapsed-time multipliers; >1 produces the «час перевищено» red state */
const ELAPSED_FACTORS = [0.5, 1.2, 0.3, 0.8];

/** Resource statuses cycled across the mock resources */
const RESOURCE_STATUSES: TripResourceStatus[] = [
    'waiting',
    'moving',
    'offRoute'
];

/**
 * Builds the deterministic mock trip list behind the «Активні рейси» and
 * «Архівні рейси» pages: one trip per mock route, alternating between an
 * active trip and an archived (finished/cancelled) one. Replaced by the
 * real API later.
 * @returns {Trip[]} Mock trips (both active and archived).
 */
export const generateTrips = (): Trip[] =>
    generateRoutes().map((route, i): Trip => {
        const plannedDistanceKm = Math.max(routeDistanceKm(route), 10);
        const plannedMinutes = Math.max(routeDurationMinutes(route), 60);
        const active = i % 2 === 0;
        const start = new Date(
            2026,
            2,
            1 + (i % 28),
            6 + (i % 12),
            (i % 4) * 15
        );
        const actualMinutes =
            plannedMinutes +
            (i % 6 === 2 ? 10 + (i % 20) : -Math.min(plannedMinutes - 30, 40));
        const actualDistanceKm =
            plannedDistanceKm + (i % 7 === 3 ? 3 + (i % 4) : -(i % 5));
        const finish = new Date(start.getTime() + actualMinutes * 60_000);
        const resources = route.vehicleIds.map((vehicleId, k): TripResource => {
            const address = mockRouteAddresses[
                (i + k) % mockRouteAddresses.length
            ] as MockRouteAddress;
            return {
                vehicleId,
                driverId: route.driverIds[k % route.driverIds.length] ?? '',
                status: RESOURCE_STATUSES[
                    (i + k) % RESOURCE_STATUSES.length
                ] as TripResourceStatus,
                progressKm: Math.round(
                    plannedDistanceKm *
                        (PROGRESS_FACTORS[
                            (i + k) % PROGRESS_FACTORS.length
                        ] as number)
                ),
                startedAt: start.toISOString(),
                elapsedMinutes: Math.round(
                    plannedMinutes *
                        (ELAPSED_FACTORS[
                            (i + k) % ELAPSED_FACTORS.length
                        ] as number)
                ),
                lastAddress: address.label
            };
        });
        return {
            id: `t${i + 1}`,
            routeId: route.id,
            status: active ? 'active' : i % 4 === 1 ? 'finished' : 'cancelled',
            startAt: start.toISOString(),
            finishAt: active ? null : finish.toISOString(),
            plannedDistanceKm,
            actualDistanceKm,
            plannedMinutes,
            actualMinutes,
            trackMatchPercent: (i * 37 + 4) % 100,
            resources
        };
    });
