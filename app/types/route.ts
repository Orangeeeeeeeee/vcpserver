/** Position of a point within the route */
export type RoutePointKind = 'start' | 'intermediate' | 'finish';

/** Kind of an intermediate route point (the «Тип точки» select) */
export type RoutePointType =
    | 'stop'
    | 'busStation'
    | 'checkpoint'
    | 'technicalStop'
    | 'rest';

/** Geographic coordinates as a `[lat, lng]` tuple */
export type RouteCoords = [number, number];

/** A single point of a regular route */
export interface RoutePoint {
    id: string;
    kind: RoutePointKind;
    /** Display address, e.g. "Київ, вул. Хрещатик, 1" */
    address: string;
    /** Point location; null when the address was typed without a map match */
    coords: RouteCoords | null;
    /** Optional display name, e.g. "Автовокзал" */
    name: string;
    /** Intermediate points only; start/finish keep null */
    type: RoutePointType | null;
    /** Arrival detection radius in meters */
    radius: number;
    /** The segment leading to this point is a straight line, not a road */
    directPath: boolean;
    /** Travel time from the previous point as "HH:mm"; null for the start */
    timeToPoint: string | null;
}

/** Lifecycle status of a route (extensible union) */
export type RouteStatus = 'active' | 'inactive';

/** A regular (scheduled) route */
export interface Route {
    id: string;
    /** Owning companies, e.g. ["Logistics UA"] */
    companies: string[];
    /** Display name of the route */
    name: string;
    status: RouteStatus;
    scheduled: boolean;
    /** ISO start date-time; null when the route is not scheduled */
    startAt: string | null;
    /** Allowed error count before the route trip is flagged */
    errorCount: number | null;
    /** The route carries passengers (enables tariff settings) */
    passenger: boolean;
    /** Intercity passenger route (enables the per-segment tariff matrix) */
    intercity: boolean;
    /** Fare is calculated in reverse point order */
    reverseCalculation: boolean;
    /** Single fare price; used when the route is not intercity */
    singlePrice: number | null;
    /**
     * Intercity fares per forward-ordered point pair, keyed
     * "{fromPointId}-{toPointId}"
     */
    segmentPrices: Record<string, number>;
    /** Ordered points: start, intermediates, finish */
    points: RoutePoint[];
    /** Assigned vehicle ids */
    vehicleIds: string[];
    /** Assigned driver ids */
    driverIds: string[];
    /** Assigned vehicle group ids */
    groupIds: string[];
}
