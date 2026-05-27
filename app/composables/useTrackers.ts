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

/** Minimal input for creating a new tracker; composable fills the rest */
export interface AddTrackerInput {
    imei: string;
    company: string;
    transport: string;
    params: string[];
}

/** Input for updating editable fields of an existing tracker */
export interface UpdateTrackerInput {
    id: string;
    company: string;
    transport: string;
    params: string[];
}

/** Return type of the {@link useTrackers} composable */
export interface UseTrackersReturn {
    /** Shared, reactive list of trackers */
    trackers: Ref<Tracker[]>;
    /** Distinct company names (for the filter dropdown) */
    companies: string[];
    /** Available transport models (for the add-tracker dialog) */
    transportModels: string[];
    /** Available sensor parameters (for the add-tracker dialog) */
    params: string[];
    /** Prepends a new tracker to the list */
    addTracker: (input: AddTrackerInput) => void;
    /** Updates editable fields of an existing tracker by id */
    updateTracker: (input: UpdateTrackerInput) => void;
    /** Removes a tracker from the list by id */
    deleteTracker: (id: string) => void;
}

const COMPANIES = ['Logistics UA', 'CityBus Group', '1 UA', 'Logistics'];

const COMPANY_BADGES: Record<string, string> = {
    'Logistics UA': 'LG',
    'CityBus Group': 'CB',
    '1 UA': '1U',
    Logistics: 'LO'
};

const TRANSPORT_MODELS = [
    'MAN TGX 18.480',
    'Volvo FH 460',
    'Scania R 500',
    'Mercedes Actros',
    'DAF XF 480',
    'Iveco Stralis'
];

const TRACKER_PARAMS = [
    'Швидкість',
    'Температура двигуна',
    'Рівень палива',
    'Пробіг',
    'Координати GPS',
    'Стан запалювання',
    'Напруга акумулятора'
];

/** Generates roughly 80 mock trackers for the table (pagination demo). */
const generateTrackers = (): Tracker[] => {
    return Array.from({ length: 80 }, (_, i) => {
        const company = COMPANIES[i % COMPANIES.length] as string;
        const transport = TRANSPORT_MODELS[
            i % TRANSPORT_MODELS.length
        ] as string;
        const paramsCount = 1 + (i % TRACKER_PARAMS.length);
        return {
            id: String(i + 1),
            company,
            companyBadge:
                COMPANY_BADGES[company] ?? company.slice(0, 2).toUpperCase(),
            imei: String(352094083412587 + i),
            port: 5023 + (i % 12),
            transport,
            transportId: `TRK-${112 + i}`,
            params: TRACKER_PARAMS.slice(0, paramsCount)
        };
    });
};

/**
 * Provides the (mock) list of trackers, shared across the app via useState.
 * Filter / pagination / sorting are handled at the consumer level.
 * @returns {UseTrackersReturn} Composable
 */
export const useTrackers = (): UseTrackersReturn => {
    const trackers = useState<Tracker[]>('trackers', () => generateTrackers());

    /** Prepends a new tracker with computed badge / port / transportId. */
    const addTracker = (input: AddTrackerInput): void => {
        const nextNumericId =
            Math.max(0, ...trackers.value.map((t) => Number(t.id) || 0)) + 1;
        const newTracker: Tracker = {
            id: String(nextNumericId),
            company: input.company,
            companyBadge:
                COMPANY_BADGES[input.company] ??
                input.company.slice(0, 2).toUpperCase(),
            imei: input.imei,
            port: 5023 + (trackers.value.length % 12),
            transport: input.transport,
            transportId: `TRK-${112 + trackers.value.length}`,
            params: input.params
        };
        trackers.value = [newTracker, ...trackers.value];
    };

    /** Replaces editable fields of the tracker with matching id. */
    const updateTracker = (input: UpdateTrackerInput): void => {
        const idx = trackers.value.findIndex((t) => t.id === input.id);
        if (idx === -1) return;
        const current = trackers.value[idx] as Tracker;
        const updated: Tracker = {
            ...current,
            company: input.company,
            companyBadge:
                COMPANY_BADGES[input.company] ??
                input.company.slice(0, 2).toUpperCase(),
            transport: input.transport,
            params: input.params
        };
        trackers.value = [
            ...trackers.value.slice(0, idx),
            updated,
            ...trackers.value.slice(idx + 1)
        ];
    };

    /** Removes the tracker with the given id, if present. */
    const deleteTracker = (id: string): void => {
        trackers.value = trackers.value.filter((t) => t.id !== id);
    };

    return {
        trackers,
        companies: COMPANIES,
        transportModels: TRANSPORT_MODELS,
        params: TRACKER_PARAMS,
        addTracker,
        updateTracker,
        deleteTracker
    };
};
