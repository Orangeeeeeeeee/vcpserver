import type { OnlineVehicle } from '~/types/online';
import type {
    HistoryTelemetryParam,
    HistoryTimelineSegment,
    VehicleHistory,
    VehicleHistoryEvent
} from '~/types/history';

/** Route anchor pairs (start → finish) the mock trips run between */
const ROUTE_ANCHORS: [[number, number], [number, number]][] = [
    [
        [50.45, 30.52], // Київ
        [49.84, 24.03] // Львів
    ],
    [
        [50.45, 30.52], // Київ
        [48.46, 35.04] // Дніпро
    ],
    [
        [49.84, 24.03], // Львів
        [48.29, 25.94] // Чернівці
    ],
    [
        [50.9, 34.4], // Суми
        [49.44, 32.06] // Черкаси
    ]
];

const ADDRESSES = [
    'вул. Братиславська, 14, Київ, Україна',
    'траса М06, 128 км, поблизу м. Житомир, Україна',
    'просп. Свободи, 28, Львів, Україна',
    'вул. Сумська, 72, Харків, Україна'
];

/** Points per telemetry series (uniform steps across the period) */
const SERIES_LENGTH = 48;

/** Formats minutes as "N г M хв" */
const asDuration = (minutes: number): string =>
    `${Math.floor(minutes / 60)} г ${minutes % 60} хв`;

/** Deterministic pseudo-random 0..1 from an integer seed */
const rand = (seed: number): number => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
};

/**
 * Builds the telemetry series of one parameter: a smooth wave around a base
 * value with a per-parameter/per-seed phase.
 */
const buildSeries = (seed: number, base: number, spread: number): number[] =>
    Array.from({ length: SERIES_LENGTH }, (_, i) => {
        const wave =
            Math.sin(i / 5 + seed) * 0.5 + Math.sin(i / 11 + seed * 2) * 0.3;
        const noise = rand(seed * 100 + i) * 0.2;
        return Math.round((base + spread * (wave + noise)) * 10) / 10;
    });

/**
 * Generates the deterministic history of one vehicle for one period: events
 * feed, summary, route polyline, timeline segments and telemetry series.
 * Parameter labels are raw device names, the way a real API reports them.
 * @param {OnlineVehicle} vehicle Vehicle whose history is generated.
 * @param {number} periodSeed Extra seed so every period looks distinct.
 * @returns {VehicleHistory} Mock history data.
 */
export const generateVehicleHistory = (
    vehicle: OnlineVehicle,
    periodSeed: number
): VehicleHistory => {
    const seed = (Number(vehicle.id.replace(/\D/g, '')) || 1) + periodSeed * 7;

    /** Route: anchors + slightly jittered midpoints, so it reads as a road */
    const [from, to] = ROUTE_ANCHORS[
        seed % ROUTE_ANCHORS.length
    ] as (typeof ROUTE_ANCHORS)[number];
    const POINTS = 14;
    const route: [number, number][] = Array.from({ length: POINTS }, (_, i) => {
        const t = i / (POINTS - 1);
        const lat = from[0] + (to[0] - from[0]) * t;
        const lng = from[1] + (to[1] - from[1]) * t;
        // perpendicular jitter, zero at the endpoints
        const bend = Math.sin(t * Math.PI) * (rand(seed * 31 + i) - 0.5) * 0.5;
        return [lat + bend, lng + bend * 0.6];
    });

    const address = (i: number): string =>
        ADDRESSES[(seed + i) % ADDRESSES.length] as string;

    const moveMinutes = (i: number): number =>
        90 + ((seed * 17 + i * 37) % 120);
    const stopMinutes = (i: number): number => 25 + ((seed * 11 + i * 23) % 45);
    const moveKm = (i: number): number => 60 + ((seed * 13 + i * 41) % 110);

    const events: VehicleHistoryEvent[] = [
        { id: 'e1', type: 'engineOn', address: address(0) },
        {
            id: 'e2',
            type: 'move',
            duration: asDuration(moveMinutes(0)),
            distanceKm: moveKm(0)
        },
        {
            id: 'e3',
            type: 'stop',
            duration: asDuration(stopMinutes(0)),
            address: address(1)
        },
        {
            id: 'e4',
            type: 'moveSpeeding',
            duration: asDuration(moveMinutes(1)),
            distanceKm: moveKm(1)
        },
        {
            id: 'e5',
            type: 'stop',
            duration: asDuration(stopMinutes(1)),
            address: address(2)
        },
        {
            id: 'e6',
            type: 'move',
            duration: asDuration(moveMinutes(2)),
            distanceKm: moveKm(2)
        },
        { id: 'e7', type: 'engineOff', address: address(3) }
    ];

    const totalMoveMinutes = moveMinutes(0) + moveMinutes(1) + moveMinutes(2);
    const totalStopMinutes = stopMinutes(0) + stopMinutes(1);

    /** Yellow idle + red speeding stretches on the timeline */
    const idleStart = 0.15 + rand(seed * 3) * 0.1;
    const speedStart = 0.55 + rand(seed * 5) * 0.1;
    const segments: HistoryTimelineSegment[] = [
        {
            id: 's1',
            type: 'idleEngine',
            start: idleStart,
            end: idleStart + 0.1
        },
        {
            id: 's2',
            type: 'speeding',
            start: speedStart,
            end: speedStart + 0.08
        }
    ];

    const params: HistoryTelemetryParam[] = [
        {
            key: 'speed',
            label: 'Speed',
            unit: 'км/год',
            values: buildSeries(seed, 52, 14)
        },
        {
            key: 'voltage',
            label: 'External Voltage',
            unit: 'V',
            values: buildSeries(seed + 1, 12.4, 0.5)
        },
        {
            key: 'engineTemp',
            label: 'Engine Temperature',
            unit: '°C',
            values: buildSeries(seed + 2, 88, 6)
        },
        {
            key: 'fuel',
            label: 'Fuel Level',
            unit: 'л',
            values: buildSeries(seed + 3, 54, 10)
        },
        {
            key: 'llsFuel',
            label: 'LLS 1 Fuel Level',
            unit: 'л',
            values: buildSeries(seed + 4, 34, 8)
        },
        {
            key: 'dallasTemp',
            label: 'Dallas Temperature 1',
            unit: '°C',
            values: buildSeries(seed + 5, 74, 5)
        }
    ];

    return {
        events,
        summary: {
            moveDistanceKm: moveKm(0) + moveKm(1) + moveKm(2),
            moveDuration: asDuration(totalMoveMinutes),
            stopsCount: 2 + (seed % 8),
            stopsDuration: asDuration(totalStopMinutes)
        },
        route,
        segments,
        params,
        addresses: ADDRESSES
    };
};
