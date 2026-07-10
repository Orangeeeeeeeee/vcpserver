import type { TripResourceStatus, TripStatus } from '~/types/trip';

/** Display metadata of a trip / trip-resource status badge */
export interface TripStatusMeta {
    /** i18n key of the badge label */
    labelKey: string;
    /** Tailwind classes of the badge pill */
    badgeClass: string;
}

/** Trip statuses selectable in the archive «Стан» filter, in display order */
export const ARCHIVE_TRIP_STATUSES: TripStatus[] = ['finished', 'cancelled'];

/** Display metadata per trip status (archive «Стан» column and filter) */
export const TRIP_STATUS_META: Record<TripStatus, TripStatusMeta> = {
    active: {
        labelKey: 'routes.trips.list.statuses.active',
        badgeClass: 'bg-sky-100 text-sky-700'
    },
    finished: {
        labelKey: 'routes.trips.list.statuses.finished',
        badgeClass: 'bg-green-100 text-green-700'
    },
    cancelled: {
        labelKey: 'routes.trips.list.statuses.cancelled',
        badgeClass: 'bg-red-100 text-red-600'
    }
};

/** Display metadata per resource status (the resources dialog «Статус») */
export const TRIP_RESOURCE_STATUS_META: Record<
    TripResourceStatus,
    TripStatusMeta
> = {
    waiting: {
        labelKey: 'routes.trips.resources.statuses.waiting',
        badgeClass: 'bg-amber-100 text-amber-700'
    },
    moving: {
        labelKey: 'routes.trips.resources.statuses.moving',
        badgeClass: 'bg-green-100 text-green-700'
    },
    offRoute: {
        labelKey: 'routes.trips.resources.statuses.offRoute',
        badgeClass: 'bg-red-100 text-red-600'
    }
};

/**
 * Chip classes of the «Збіг треків» percentage: ≥75 green, 25–74 amber,
 * <25 red.
 * @param percent - Track match percentage, 0–100.
 * @returns {string} Tailwind classes of the chip.
 */
export const trackMatchClass = (percent: number): string => {
    if (percent >= 75) return 'bg-green-100 text-green-700';
    if (percent >= 25) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-600';
};
