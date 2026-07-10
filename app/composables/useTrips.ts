import { generateTrips } from '~/mocks/trips';
import type { Trip } from '~/types/trip';

/** Return type of the {@link useTrips} composable */
export interface UseTripsReturn {
    /** Shared, reactive list of trips (active and archived) */
    trips: Ref<Trip[]>;
    /** Removes the trip with the given id */
    deleteTrip: (id: string) => void;
}

/**
 * Provides the (mock) list of trips, shared across the app via useState.
 * Seeded with the deterministic mock catalog; trips are only deleted, the
 * designs have no create/edit flows.
 * @returns {UseTripsReturn} Composable
 */
export const useTrips = (): UseTripsReturn => {
    const trips = useState<Trip[]>('trips', () => generateTrips());

    /** Removes the trip with the given id. */
    const deleteTrip = (id: string): void => {
        trips.value = trips.value.filter((trip) => trip.id !== id);
    };

    return { trips, deleteTrip };
};
