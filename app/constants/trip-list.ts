import type { TripResourceStatus, TripStatus } from '~/types/trip';
import type { PrimitiveColorName } from '~/theme/colors';

/** Display metadata of a trip / trip-resource status badge */
export interface TripStatusMeta {
    /** i18n key of the badge label */
    labelKey: string;
    /** Palette accent of the status chip (`UiColorChip`) */
    badgeColor: PrimitiveColorName;
}

/** Trip statuses selectable in the archive «Стан» filter, in display order */
export const ARCHIVE_TRIP_STATUSES: TripStatus[] = ['finished', 'cancelled'];

/** Display metadata per trip status (archive «Стан» column and filter) */
export const TRIP_STATUS_META: Record<TripStatus, TripStatusMeta> = {
    active: {
        labelKey: 'routes.trips.list.statuses.active',
        badgeColor: 'sky'
    },
    finished: {
        labelKey: 'routes.trips.list.statuses.finished',
        badgeColor: 'green'
    },
    cancelled: {
        labelKey: 'routes.trips.list.statuses.cancelled',
        badgeColor: 'red'
    }
};

/** Display metadata per resource status (the resources dialog «Статус») */
export const TRIP_RESOURCE_STATUS_META: Record<
    TripResourceStatus,
    TripStatusMeta
> = {
    waiting: {
        labelKey: 'routes.trips.resources.statuses.waiting',
        badgeColor: 'amber'
    },
    moving: {
        labelKey: 'routes.trips.resources.statuses.moving',
        badgeColor: 'green'
    },
    offRoute: {
        labelKey: 'routes.trips.resources.statuses.offRoute',
        badgeColor: 'red'
    }
};

/**
 * Chip accent of the «Збіг треків» percentage: ≥75 green, 25–74 amber,
 * <25 red.
 * @param percent - Track match percentage, 0–100.
 * @returns {PrimitiveColorName} Palette accent of the chip (`UiColorChip`).
 */
export const trackMatchColor = (percent: number): PrimitiveColorName => {
    if (percent >= 75) return 'green';
    if (percent >= 25) return 'amber';
    return 'red';
};
