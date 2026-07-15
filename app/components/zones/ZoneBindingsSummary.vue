<template>
    <SharedAnimatedHeight v-if="hasBindings" class="flex flex-col gap-3">
        <ZonesZoneBindingsGroups :chips="visibleGroupChips" />

        <ZonesZoneBindingsVehicles
            v-model:expanded="listExpanded"
            :rows="visibleVehicleRows"
            :zone-color="zone.color"
            :expandable="hasHiddenItems"
        />
    </SharedAnimatedHeight>
</template>

<script lang="ts">
import type { Zone } from '~/types/zone';
import { ZONE_TRIGGER_ICONS } from '~/constants/zones';
import { primitiveColors } from '~/theme/colors';
import type { ZoneGroupChip } from './ZoneBindingsGroups.vue';
import type { ZoneVehicleRow } from './ZoneBindingsVehicles.vue';

/** Group chips shown before collapsing the rest behind «Розгорнути» */
const MAX_GROUP_CHIPS = 5;

/** Vehicle rows shown before collapsing the rest behind «Розгорнути» */
const MAX_VEHICLE_ROWS = 2;
</script>

<script setup lang="ts">
interface ZoneBindingsSummaryProps {
    zone: Zone;
}

const props = defineProps<ZoneBindingsSummaryProps>();

const { groups } = useGroups();
const { vehicles } = useVehicles();
const { drivers } = useDrivers();

/** Whether the truncated group/vehicle lists are fully shown */
const listExpanded = ref<boolean>(false);

/** Group lookup for the binding chips */
const groupById = computed(
    () => new Map(groups.value.map((group) => [group.id, group]))
);

/** Vehicle lookup for the binding rows */
const vehicleById = computed(
    () => new Map(vehicles.value.map((vehicle) => [vehicle.id, vehicle]))
);

/** Driver lookup for the vehicle rows */
const driverById = computed(
    () => new Map(drivers.value.map((driver) => [driver.id, driver]))
);

/** Chips of every group binding (one chip per bound group) */
const groupChips = computed<ZoneGroupChip[]>(() =>
    props.zone.groupBindings.flatMap((binding, bindingIndex) =>
        binding.ids.flatMap((id) => {
            const group = groupById.value.get(id);
            if (!group) return [];
            return [
                {
                    key: `${bindingIndex}:${id}`,
                    icon: ZONE_TRIGGER_ICONS[binding.trigger],
                    name: group.name,
                    background: primitiveColors[group.color]['100'],
                    color: primitiveColors[group.color]['600']
                }
            ];
        })
    )
);

/** Rows of every vehicle binding (one row per bound vehicle) */
const vehicleRows = computed<ZoneVehicleRow[]>(() =>
    props.zone.vehicleBindings.flatMap((binding, bindingIndex) =>
        binding.ids.flatMap((id) => {
            const vehicle = vehicleById.value.get(id);
            if (!vehicle) return [];
            const driver = vehicle.driverId
                ? driverById.value.get(vehicle.driverId)
                : undefined;
            return [
                {
                    key: `${bindingIndex}:${id}`,
                    icon: ZONE_TRIGGER_ICONS[binding.trigger],
                    label: `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`,
                    driverName: driver?.name ?? null
                }
            ];
        })
    )
);

/** True when the zone has at least one group or vehicle binding to show */
const hasBindings = computed<boolean>(
    () => groupChips.value.length > 0 || vehicleRows.value.length > 0
);

/** Group chips visible in the summary (first N unless expanded) */
const visibleGroupChips = computed<ZoneGroupChip[]>(() =>
    listExpanded.value
        ? groupChips.value
        : groupChips.value.slice(0, MAX_GROUP_CHIPS)
);

/** Vehicle rows visible in the summary (first N unless expanded) */
const visibleVehicleRows = computed<ZoneVehicleRow[]>(() =>
    listExpanded.value
        ? vehicleRows.value
        : vehicleRows.value.slice(0, MAX_VEHICLE_ROWS)
);

/** True when the «Розгорнути / Згорнути» toggle has something to reveal */
const hasHiddenItems = computed<boolean>(
    () =>
        groupChips.value.length > MAX_GROUP_CHIPS ||
        vehicleRows.value.length > MAX_VEHICLE_ROWS
);
</script>
