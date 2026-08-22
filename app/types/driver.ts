export type DriverStatus = 'active' | 'blocked' | 'vacation' | 'unavailable';

export interface DriverLicense {
    /** License identifier, e.g. "DL-UA-78451239" */
    id: string;
    /** Display-ready expiration date, e.g. "18.09.2027" */
    expiresAt: string;
    /** Display-ready categories, e.g. "B, C" */
    categories: string;
}

export interface DriverDocument {
    id: string;
    /** Display name, e.g. "Водійське посвідчення (скан)" */
    name: string;
    /** Captured file name (UI-only; no real file is stored) */
    fileName?: string;
    /** URL of a (mock) scan preview shown as the thumbnail */
    previewUrl?: string;
}

export interface Driver {
    id: string;
    /** Full name, e.g. "Василь Прийма" */
    name: string;
    /** Two-letter initials for the avatar, e.g. "ВП" */
    initials: string;
    /** Owning company, e.g. "Logistics UA" */
    company: string;
    status: DriverStatus;
    /** Transport model, e.g. "MAN TGX 18.480" */
    transport: string;
    /** Transport identifier, e.g. "TRK-112" */
    transportId: string;
    /** Display-ready phone, e.g. "+380 67 458 29 14" */
    phone: string;
    email: string;
    license: DriverLicense;
    /** Display-ready start date, e.g. "12.04.2022" */
    startedAt: string;
    /** Display-ready employment type, e.g. "Повна зайнятість" */
    employment: string;
    /** Optional free-text comment about the driver */
    comment?: string;
    /** Optional avatar image URL (blob URL in mock) */
    avatarUrl?: string;
    /** Optional list of attached documents */
    documents?: DriverDocument[];
}
