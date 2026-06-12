import type { IdleRecord } from '~/types/report';

/** Mock geo-zone catalog for the idle-report filter */
export const GEO_ZONES = [
    'Зона 1',
    'Зона 2',
    'Зона 3',
    'Зона 4',
    'Зона 5',
    'Зона 6'
];

const VEHICLES = [
    'MAN TGX 18.480',
    'Volvo FH 460',
    'Scania R 500',
    'Mercedes Actros',
    'DAF XF 480',
    'Iveco Stralis'
];

const ADDRESSES = [
    'вул. Братиславська, 14, Київ, Україна',
    'просп. Свободи, 28, Львів, Україна',
    'вул. Дерибасівська, 5, Одеса, Україна',
    'вул. Сумська, 72, Харків, Україна'
];

/** Stop durations cycled across rows, minutes */
const DURATIONS = [10, 25, 5, 40, 15, 30];

/** Pads a number to 2 digits */
const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Formats minutes-since-midnight as "hh:mm" */
const fmtTime = (minutes: number): string =>
    `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`;

/**
 * Generates 72 mock idle records (8 pages × 9 rows) within 09.03–20.03.2026.
 * Times never cross midnight; the first row matches the mockup
 * (08:15 → 08:25, 10 хв).
 * @returns Mock idle report rows
 */
export const generateIdleRecords = (): IdleRecord[] => {
    return Array.from({ length: 72 }, (_, i) => {
        // i = 0 lands on 08:15 (6:00 base + 135 offset)
        const start = 6 * 60 + ((135 + i * 37) % (14 * 60));
        const duration = DURATIONS[i % DURATIONS.length] as number;
        const stopDate = `${pad2(9 + (i % 12))}.03.2026`;
        return {
            id: String(i + 1),
            vehicle: VEHICLES[i % VEHICLES.length] as string,
            vehicleId: `TRK-${112 + (i % VEHICLES.length)}`,
            stopDate,
            stopTime: fmtTime(start),
            address: ADDRESSES[i % ADDRESSES.length] as string,
            resumeDate: stopDate,
            resumeTime: fmtTime(start + duration),
            duration: `${duration} хв`
        };
    });
};
