import type { ZoneGeometry } from '~/types/zone';

/** Mean Earth radius in meters (spherical approximation) */
const EARTH_RADIUS_M = 6371008.8;

/**
 * Area of a spherical polygon given `[lat, lng]` vertices, in m².
 * Uses the same spherical excess approximation as turf.js — accurate enough
 * for zone-sized shapes.
 * @param {[number, number][]} points Polygon ring, `[lat, lng]` degrees.
 * @returns {number} Area in square meters.
 */
const sphericalPolygonArea = (points: [number, number][]): number => {
    if (points.length < 3) return 0;
    const rad = (deg: number): number => (deg * Math.PI) / 180;
    let total = 0;
    for (let i = 0; i < points.length; i++) {
        const [lat1, lng1] = points[i] as [number, number];
        const [lat2, lng2] = points[(i + 1) % points.length] as [
            number,
            number
        ];
        total +=
            (rad(lng2) - rad(lng1)) *
            (2 + Math.sin(rad(lat1)) + Math.sin(rad(lat2)));
    }
    return Math.abs((total * EARTH_RADIUS_M * EARTH_RADIUS_M) / 2);
};

/**
 * Computes the zone area in km² from its geometry.
 * @param {ZoneGeometry} geometry Zone shape.
 * @returns {number} Area in square kilometers.
 */
export const zoneAreaKm2 = (geometry: ZoneGeometry): number => {
    const areaM2 =
        geometry.kind === 'circle'
            ? Math.PI * geometry.radius * geometry.radius
            : sphericalPolygonArea(geometry.points);
    return areaM2 / 1_000_000;
};

/**
 * Formats a km² area for the zone card badge, e.g. `2.4` or `12`.
 * Values under 10 keep one decimal; larger ones are rounded to integers.
 * @param {number} km2 Area in square kilometers.
 * @returns {string} Display-ready number without the unit.
 */
export const formatZoneArea = (km2: number): string =>
    km2 < 10 ? km2.toFixed(1) : String(Math.round(km2));
