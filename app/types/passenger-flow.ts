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
