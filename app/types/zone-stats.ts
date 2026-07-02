/** Live status of a vehicle currently inside a zone */
export type ZoneVehicleStatus = 'moving' | 'paused' | 'alert';

/** A single zone entry/exit event of the selected day */
export interface ZoneVisitEvent {
    /** Vehicle id (resolved against `useVehicles`) */
    vehicleId: string;
    /** Display-ready time, e.g. "04:12" */
    time: string;
    /** Display-ready date, e.g. "12.03.2026" */
    date: string;
}

/** A vehicle currently inside the zone (drives the detail map markers) */
export interface ZoneVehicleInZone {
    /** Vehicle id (resolved against `useVehicles`) */
    vehicleId: string;
    /** Marker position, `[lat, lng]` */
    position: [number, number];
    status: ZoneVehicleStatus;
}

/** Mock statistics of a zone for one selected day */
export interface ZoneStats {
    /** Vehicles inside the zone right now (the «У зоні зараз» badge) */
    currentCount: number;
    /** Vehicles-in-zone count per hour of the day (24 points, chart data) */
    occupancyByHour: number[];
    /** Zone entry events of the day, newest first */
    entries: ZoneVisitEvent[];
    /** Zone exit events of the day, newest first */
    exits: ZoneVisitEvent[];
    /** Total vehicle time spent in the zone, minutes */
    totalMinutes: number;
    /** Average vehicle time spent in the zone, minutes */
    averageMinutes: number;
    /** Vehicles currently inside the zone with map positions */
    vehiclesInZone: ZoneVehicleInZone[];
}
