export interface Tracker {
    /** Unique tracker id */
    id: string;
    /** Owning company name */
    company: string;
    /** 2-letter company badge (for avatar) */
    companyBadge: string;
    /** IMEI of the tracker device */
    imei: string;
    /** Port number */
    port: number;
    /** Transport model name */
    transport: string;
    /** Transport identifier (e.g. TRK-112) */
    transportId: string;
    /** Monitored parameter names */
    params: string[];
}
