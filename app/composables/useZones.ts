import type { Zone } from '~/types/zone';
import { generateZones } from '~/mocks/zones';
import { ZONE_COLORS } from '~/constants/zones';

/** Fields needed to create a zone; id and color are assigned automatically */
export type CreateZoneInput = Omit<Zone, 'id' | 'color'>;

/** Return type of the {@link useZones} composable */
export interface UseZonesReturn {
    /** Shared, reactive list of zones */
    zones: Ref<Zone[]>;
    /** Prepends a new zone with a generated id and rotated color */
    createZone: (zone: CreateZoneInput) => Zone;
    /** Replaces an existing zone by id and returns it */
    updateZone: (zone: Zone) => Zone;
}

/**
 * Provides the (mock) list of zones, shared across the app via useState.
 * @returns {UseZonesReturn} Composable
 */
export const useZones = (): UseZonesReturn => {
    const zones = useState<Zone[]>('zones', () => generateZones());

    /** Prepends a new zone with a computed id and a rotated accent color. */
    const createZone = (zone: CreateZoneInput): Zone => {
        const nextId =
            Math.max(0, ...zones.value.map((z) => Number(z.id) || 0)) + 1;
        const newZone: Zone = {
            ...zone,
            id: String(nextId),
            color: ZONE_COLORS[
                zones.value.length % ZONE_COLORS.length
            ] as Zone['color']
        };
        zones.value = [newZone, ...zones.value];
        return newZone;
    };

    /** Replaces the zone with the same id, if present. */
    const updateZone = (zone: Zone): Zone => {
        zones.value = zones.value.map((z) => (z.id === zone.id ? zone : z));
        return zone;
    };

    return { zones, createZone, updateZone };
};
