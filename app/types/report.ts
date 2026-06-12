export type ReportCategory = 'activity' | 'routes' | 'drivers' | 'fuel';

/** Catalog tab value: a category or the "all reports" pseudo-tab */
export type ReportCatalogTab = 'all' | ReportCategory;

export type ReportId =
    | 'activity'
    | 'idle'
    | 'geozones'
    | 'trips'
    | 'routeDeviation'
    | 'driverActivity'
    | 'speeding'
    | 'drivingStyle'
    | 'fuelCosts'
    | 'fuelEfficiency'
    | 'fuelAnomalies';

export interface ReportDefinition {
    /** i18n lookup key: `reports.items.<id>.title` / `.description` */
    id: ReportId;
    category: ReportCategory;
    /** Tabler icon name for the catalog tile */
    icon: string;
    /** Route target; only implemented reports have one — others toast "in development" */
    to?: string;
}

/** A single row of the generated idle report */
export interface IdleRecord {
    id: string;
    /** Vehicle display name, e.g. "MAN TGX 18.480" */
    vehicle: string;
    /** Vehicle identifier, e.g. "TRK-112" */
    vehicleId: string;
    /** Display-ready stop date, e.g. "11.03.2026" */
    stopDate: string;
    /** Display-ready stop time, e.g. "08:15" */
    stopTime: string;
    address: string;
    /** Display-ready movement-resume date */
    resumeDate: string;
    /** Display-ready movement-resume time */
    resumeTime: string;
    /** Display-ready stop duration, e.g. "10 хв" */
    duration: string;
}
