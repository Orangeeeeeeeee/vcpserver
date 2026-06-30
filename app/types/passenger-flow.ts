/** Single trip of a transport vehicle */
export interface PassengerFlowTrip {
    /** Unique trip id (used in the trip detail route) */
    id: string;
    /** Id of the transport that performed the trip */
    transportId: string;
    /** Departure date and time */
    departureAt: string;
    /** Arrival date and time */
    arrivalAt: string;
    /** Route start point */
    fromLocation: string;
    /** Route end point */
    toLocation: string;
    /** Time spent on the road */
    duration: string;
    /** Travelled distance, km */
    distance: number;
    /** Number of stop points on the route */
    pointsCount: number;
    /** Carried passengers count */
    passengers: number;
    /** Average revenue per passenger, UAH */
    pricePerPassenger: number;
    /** Profit, UAH */
    profit: number;
}

/** Single fare segment within a trip stop's collected amount */
export interface PassengerFlowAmountEntry {
    /** Number of passengers in this fare segment */
    count: number;
    /** Fare price per passenger, UAH */
    price: number;
    /** Segment total, UAH */
    total: number;
    /** Optional destination location for this fare segment */
    location?: string;
}

/** Single stop point within a trip */
export interface PassengerFlowTripStop {
    /** Unique stop id */
    id: string;
    /** Departure datetime from the stop, format "yyyy-mm-dd HH:MM" */
    departureTime: string;
    /** Zone name */
    zone: string;
    /** Distance from the previous stop, km */
    distance: number;
    /** Passengers on board after the stop */
    passengers: number;
    /** Passengers that boarded at the stop */
    boarded: number;
    /** Passengers that alighted at the stop */
    alighted: number;
    /** Amount collected, UAH */
    amount: number;
    /** Breakdown of the collected amount by fare price */
    amountBreakdown: PassengerFlowAmountEntry[];
    /** Photo URL taken at the stop */
    photo: string;
}

export interface PassengerFlowRecord {
    /** Unique record id */
    id: string;
    /** Transport model name */
    transport: string;
    /** Transport identifier (e.g. TRK-112) */
    transportId: string;
    /** Group name shown as a tag */
    group: string;
    /** Driver full name */
    driver: string;
    /** Completed trips count */
    trips: number;
    /** Travelled distance, km */
    distance: number;
    /** Carried passengers count */
    passengers: number;
    /** Profit, UAH */
    profit: number;
}
