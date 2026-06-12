import type { PassengerFlowRecord } from '~/types/passenger-flow';
import { generatePassengerFlowRecords } from '~/mocks/passenger-flow';

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
