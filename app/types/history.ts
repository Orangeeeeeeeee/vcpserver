/** Fixed options of the history date filter */
export type HistoryPeriod =
    | 'today'
    | 'yesterday'
    | 'dayBefore'
    | 'last7days'
    | 'custom';

/** Kind of an entry in the history events feed */
export type HistoryEventType =
    | 'engineOn'
    | 'move'
    | 'moveSpeeding'
    | 'stop'
    | 'engineOff';

export interface VehicleHistoryEvent {
    id: string;
    type: HistoryEventType;
    /** Display-ready duration, e.g. "2 г 45 хв" (move/stop) */
    duration?: string;
    /** Covered distance, km (move) */
    distanceKm?: number;
    /** Display-ready address (engineOn/engineOff/stop) */
    address?: string;
}

/** Totals shown in the summary cards under the events feed */
export interface VehicleHistorySummary {
    moveDistanceKm: number;
    /** Display-ready total movement time, e.g. "6 г 45 хв" */
    moveDuration: string;
    stopsCount: number;
    /** Display-ready total stops time */
    stopsDuration: string;
}

/** Highlighted stretch of the history timeline (fractions of the period) */
export interface HistoryTimelineSegment {
    id: string;
    /** Badge/color kind: idling engine (yellow) or speeding (red) */
    type: 'idleEngine' | 'speeding';
    /** Segment bounds as 0..1 fractions of the period */
    start: number;
    end: number;
}

/** One device parameter charted in the telemetry panel */
export interface HistoryTelemetryParam {
    key: string;
    /** Raw device parameter name, e.g. "Speed" (not translated) */
    label: string;
    /** Value unit, e.g. "км/год" */
    unit: string;
    /** Value series over the period (uniform time steps) */
    values: number[];
}

/** Everything the history tab shows for one vehicle and period */
export interface VehicleHistory {
    events: VehicleHistoryEvent[];
    summary: VehicleHistorySummary;
    /** Route polyline as [lat, lng] tuples (start → finish) */
    route: [number, number][];
    segments: HistoryTimelineSegment[];
    params: HistoryTelemetryParam[];
    /** Addresses cycled by the playback position */
    addresses: string[];
}
