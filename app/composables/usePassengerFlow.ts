import type { PassengerFlowRecord, PassengerFlowTrip, PassengerFlowTripStop } from '~/types/passenger-flow';
import {
    generatePassengerFlowRecords,
    generatePassengerFlowTrips,
    generatePassengerFlowTripStops
} from '~/mocks/passenger-flow';

/** Return type of the {@link usePassengerFlow} composable */
export interface UsePassengerFlowReturn {
    /** Shared, reactive list of passenger flow records */
    records: Ref<PassengerFlowRecord[]>;
}

/**
 * Provides the (mock) passenger flow records, shared across the app via useState.
 * Filter / pagination / sorting are handled at the consumer level.
 * @returns {UsePassengerFlowReturn} Composable
 */
export const usePassengerFlow = (): UsePassengerFlowReturn => {
    const records = useState<PassengerFlowRecord[]>(
        'passenger-flow-records',
        () => generatePassengerFlowRecords()
    );

    return { records };
};

/** Return type of the {@link usePassengerFlowGroupFilter} composable */
export interface UsePassengerFlowGroupFilterReturn {
    /** Shared, reactive list of currently selected group names ("Logistics", "CityBus" etc.). Empty list means no filter is applied */
    selectedGroups: Ref<string[]>;
}

/**
 * Provides the shared group filter selection for the passenger flow page,
 * so the filter bar and the table stay in sync via useState.
 * @returns {UsePassengerFlowGroupFilterReturn} Composable
 */
export const usePassengerFlowGroupFilter = (): UsePassengerFlowGroupFilterReturn => {
    const selectedGroups = useState<string[]>('passenger-flow-selected-groups', () => []);

    return { selectedGroups };
};

/** Time period filter values, from the shortest to the longest range */
export type PassengerFlowPeriod = '1h' | '8h' | '24h' | '3d' | '7d' | 'all' | 'custom';

/** Return type of the {@link usePassengerFlowPeriodFilter} composable */
export interface UsePassengerFlowPeriodFilterReturn {
    /** Shared, reactive currently selected time period */
    selectedPeriod: Ref<PassengerFlowPeriod>;
    /** Shared, reactive custom date range used when {@link selectedPeriod} is "custom" */
    customRange: Ref<[Date | null, Date | null]>;
}

/** Scale factor applied to weekly totals/series for each fixed time period, relative to "7d" */
export const PASSENGER_FLOW_PERIOD_FACTORS: Record<Exclude<PassengerFlowPeriod, 'custom'>, number> = {
    '1h': 1 / 168,
    '8h': 8 / 168,
    '24h': 24 / 168,
    '3d': 72 / 168,
    '7d': 1,
    all: 4
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Returns the scale factor applied to weekly totals/series for the selected period,
 * resolving "custom" against the provided date range (relative to a 7-day week).
 * @param period - Selected time period
 * @param customRange - Custom date range used when `period` is "custom"
 * @returns Scale factor relative to "7d"
 */
export const getPassengerFlowPeriodFactor = (
    period: PassengerFlowPeriod,
    customRange: [Date | null, Date | null]
): number => {
    if (period !== 'custom') return PASSENGER_FLOW_PERIOD_FACTORS[period];

    const [start, end] = customRange;
    if (!start || !end) return PASSENGER_FLOW_PERIOD_FACTORS['7d'];

    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1);
    return days / 7;
};

/**
 * Provides the shared time period filter selection for the passenger flow page,
 * so the filter bar, totals and charts stay in sync via useState.
 * @returns {UsePassengerFlowPeriodFilterReturn} Composable
 */
export const usePassengerFlowPeriodFilter = (): UsePassengerFlowPeriodFilterReturn => {
    const selectedPeriod = useState<PassengerFlowPeriod>('passenger-flow-selected-period', () => 'all');
    const customRange = useState<[Date | null, Date | null]>('passenger-flow-custom-range', () => [null, null]);

    return { selectedPeriod, customRange };
};

/** Return type of the {@link usePassengerFlowTrips} composable */
export interface UsePassengerFlowTripsReturn {
    /** Shared, reactive list of trips for the given transport */
    trips: Ref<PassengerFlowTrip[]>;
}

/**
 * Provides the (mock) trip list for a given transport, shared across the app via useState.
 * @param transportId - Id of the transport to load trips for
 * @returns {UsePassengerFlowTripsReturn} Composable
 */
export const usePassengerFlowTrips = (transportId: string): UsePassengerFlowTripsReturn => {
    const trips = useState<PassengerFlowTrip[]>(
        `passenger-flow-trips-${transportId}`,
        () => generatePassengerFlowTrips(transportId)
    );

    return { trips };
};

/** Return type of the {@link usePassengerFlowTripStops} composable */
export interface UsePassengerFlowTripStopsReturn {
    /** Shared, reactive list of stop points for the given trip */
    stops: Ref<PassengerFlowTripStop[]>;
}

/**
 * Provides the (mock) stop points for a given trip, shared across the app via useState.
 * @param tripId - Id of the trip to load stops for
 * @param pointsCount - Number of stops to generate
 * @returns {UsePassengerFlowTripStopsReturn} Composable
 */
export const usePassengerFlowTripStops = (tripId: string, pointsCount: number): UsePassengerFlowTripStopsReturn => {
    const stops = useState<PassengerFlowTripStop[]>(
        `passenger-flow-trip-stops-${tripId}`,
        () => generatePassengerFlowTripStops(tripId, pointsCount)
    );

    return { stops };
};
