import { haversineKm } from '~/utils/geo';
import type { Route } from '~/types/route';

/**
 * Total straight-line length of a route, summed over consecutive points.
 * Segments missing a location on either end are skipped.
 * @param route - Route whose points are measured.
 * @returns {number} Rounded distance in kilometers.
 */
export const routeDistanceKm = (route: Route): number => {
    let km = 0;
    for (let i = 1; i < route.points.length; i++) {
        const from = route.points[i - 1]?.coords;
        const to = route.points[i]?.coords;
        if (from && to) km += haversineKm(from, to);
    }
    return Math.round(km);
};

/**
 * Total travel time of a route as the sum of its "HH:mm" segment durations.
 * @param route - Route whose points are summed.
 * @returns {number} Duration in minutes.
 */
export const routeDurationMinutes = (route: Route): number => {
    let minutes = 0;
    for (const point of route.points) {
        const match = /^(\d{1,2}):(\d{2})$/.exec(point.timeToPoint ?? '');
        if (match) minutes += Number(match[1]) * 60 + Number(match[2]);
    }
    return minutes;
};
