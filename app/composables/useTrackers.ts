import type { Tracker } from '~/types/tracker';
import {
    COMPANIES,
    COMPANY_BADGES,
    TRANSPORT_MODELS,
    TRACKER_PARAMS,
    generateTrackers
} from '~/mocks/trackers';

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
