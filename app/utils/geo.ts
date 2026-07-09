/** Mean Earth radius in kilometers (used by {@link haversineKm}) */
const EARTH_RADIUS_KM = 6371;

/**
 * Great-circle (haversine) distance between two coordinates.
 * @param a - First point as a `[lat, lng]` tuple.
 * @param b - Second point as a `[lat, lng]` tuple.
 * @returns {number} Distance in kilometers.
 */
export const haversineKm = (
    a: [number, number],
    b: [number, number]
): number => {
    const toRad = (deg: number): number => (deg * Math.PI) / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLng = toRad(b[1] - a[1]);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};
