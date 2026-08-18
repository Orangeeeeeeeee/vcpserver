import type { Zone } from '~/types/zone';
import type {
    ZoneStats,
    ZoneVehicleInZone,
    ZoneVehicleStatus,
    ZoneVisitEvent
} from '~/types/zone-stats';

/** Vehicle statuses in mock rotation order */
const STATUSES: ZoneVehicleStatus[] = ['moving', 'paused', 'alert'];

/**
 * Deterministic PRNG (mulberry32); seeded from the zone id and the date so
 * the same day always shows the same mock statistics.
 * @param {number} seed Initial seed.
 * @returns {() => number} Generator of floats in [0, 1).
 */
const mulberry32 = (seed: number): (() => number) => {
    let a = seed;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

/** Builds a numeric seed from arbitrary strings */
const seedFrom = (...parts: string[]): number => {
    let h = 2166136261;
    for (const ch of parts.join('|')) {
        h ^= ch.charCodeAt(0);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

/** Bounding box of a zone geometry as `[minLat, minLng, maxLat, maxLng]` */
const geometryBBox = (
    geometry: Zone['geometry']
): [number, number, number, number] => {
    if (geometry.kind === 'circle') {
        // ~meters to degrees (latitude); good enough for mock positions
        const d = geometry.radius / 111_000;
        const [lat, lng] = geometry.center;
        return [lat - d, lng - d, lat + d, lng + d];
    }
    const lats = geometry.points.map(([lat]) => lat);
    const lngs = geometry.points.map(([, lng]) => lng);
    return [
        Math.min(...lats),
        Math.min(...lngs),
        Math.max(...lats),
        Math.max(...lngs)
    ];
};

/** Params of {@link generateZoneStats} */
export interface GenerateZoneStatsParams {
    zone: Zone;
    /** Display-ready selected date, e.g. "12.03.2026" (part of the seed) */
    date: string;
    /** Vehicle id catalog to pick event/marker vehicles from */
    vehicleIds: string[];
}

/**
 * Generates deterministic mock statistics of a zone for one day.
 * @param {GenerateZoneStatsParams} params Zone, date and vehicle catalog.
 * @returns {ZoneStats} Mock statistics for the zone detail page.
 */
export const generateZoneStats = (
    params: GenerateZoneStatsParams
): ZoneStats => {
    const { zone, date, vehicleIds } = params;
    const rand = mulberry32(seedFrom(zone.id, date));
    // Live state (current markers, currentCount) uses a zone-only seed so it
    // stays stable when the statistics date changes.
    const randLive = mulberry32(seedFrom(zone.id));

    const pickVehicle = (): string =>
        vehicleIds[Math.floor(rand() * vehicleIds.length)] ?? '1';

    const pickLiveVehicle = (): string =>
        vehicleIds[Math.floor(randLive() * vehicleIds.length)] ?? '1';

    /** Random display-ready "HH:MM" within the day */
    const randomTime = (): string => {
        const h = Math.floor(rand() * 24);
        const m = Math.floor(rand() * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const events = (count: number): ZoneVisitEvent[] =>
        Array.from({ length: count }, () => ({
            vehicleId: pickVehicle(),
            time: randomTime(),
            date
        })).sort((a, b) => b.time.localeCompare(a.time));

    // hourly occupancy: a smooth-ish random walk between 30 and 80
    const occupancyByHour: number[] = [];
    let level = 40 + Math.floor(rand() * 25);
    for (let hour = 0; hour < 24; hour++) {
        level = Math.min(80, Math.max(30, level + Math.floor(rand() * 9) - 4));
        occupancyByHour.push(level);
    }

    const [minLat, minLng, maxLat, maxLng] = geometryBBox(zone.geometry);
    const inZoneCount = 3 + Math.floor(randLive() * 10);
    const vehiclesInZone: ZoneVehicleInZone[] = Array.from(
        { length: inZoneCount },
        (_, i) => ({
            vehicleId: pickLiveVehicle(),
            position: [
                // keep away from the bbox edges so markers land inside the shape
                minLat + (0.25 + randLive() * 0.5) * (maxLat - minLat),
                minLng + (0.25 + randLive() * 0.5) * (maxLng - minLng)
            ],
            status: STATUSES[i % STATUSES.length] as ZoneVehicleStatus
        })
    );

    const averageMinutes = 45 + Math.floor(rand() * 90);
    return {
        currentCount: inZoneCount,
        occupancyByHour,
        entries: events(5 + Math.floor(rand() * 5)),
        exits: events(5 + Math.floor(rand() * 5)),
        totalMinutes: averageMinutes * inZoneCount,
        averageMinutes,
        vehiclesInZone
    };
};
