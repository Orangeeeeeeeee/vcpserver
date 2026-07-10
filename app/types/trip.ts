/** Execution status of a single trip resource (vehicle + driver pair) */
export type TripResourceStatus = 'waiting' | 'moving' | 'offRoute';

/** Lifecycle status of a trip */
export type TripStatus = 'active' | 'finished' | 'cancelled';

/** One vehicle + driver pair executing a trip, with its live progress */
export interface TripResource {
    vehicleId: string;
    driverId: string;
    status: TripResourceStatus;
    /** Kilometers already driven along the route */
    progressKm: number;
    /** ISO date-time the resource departed (or is scheduled to depart) */
    startedAt: string;
    /** Minutes on the road since departure */
    elapsedMinutes: number;
    /** Last reported address of the vehicle */
    lastAddress: string;
}

/** A single departure (trip) of a route */
export interface Trip {
    id: string;
    /** Id of the route the trip runs on */
    routeId: string;
    status: TripStatus;
    /** ISO date-time the trip started */
    startAt: string;
    /** ISO date-time the trip finished; null while the trip is active */
    finishAt: string | null;
    /** Planned route distance in kilometers (the «з 65 км» part) */
    plannedDistanceKm: number;
    /** Actually driven distance in kilometers */
    actualDistanceKm: number;
    /** Planned travel time in minutes */
    plannedMinutes: number;
    /** Actual travel time in minutes */
    actualMinutes: number;
    /** Share of the actual track matching the planned route, 0–100 */
    trackMatchPercent: number;
    /** Vehicle + driver pairs assigned to the trip */
    resources: TripResource[];
}
