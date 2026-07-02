<template>
    <div v-if="hasBindings" class="flex flex-col gap-3">
        <!-- Group binding chips -->
        <div v-if="groupChips.length" class="flex flex-col gap-2">
            <span class="text-sm font-medium text-surface-900">
                {{ $t('zones.list.groups') }}
            </span>
            <div class="flex flex-wrap gap-1.5">
                <span
                    v-for="chip in visibleGroupChips"
                    :key="chip.key"
                    class="inline-flex items-center gap-1.5 rounded px-2 py-1 text-sm"
                    :style="{
                        backgroundColor: chip.background,
                        color: chip.color
                    }"
                >
                    <Icon :name="chip.icon" class="size-4 shrink-0" />
                    {{ chip.name }}
                </span>
            </div>
        </div>

        <!-- Individual vehicle bindings -->
        <div
            v-if="vehicleRows.length"
            class="flex flex-col gap-3"
            :class="{
                'border-t border-surface-200 pt-3': groupChips.length > 0
            }"
        >
            <span class="text-sm font-medium text-surface-900">
                {{ $t('zones.list.singleVehicles') }}
            </span>
            <div
                v-for="row in visibleVehicleRows"
                :key="row.key"
                class="flex items-start gap-2"
            >
                <span
                    class="flex size-7 shrink-0 items-center justify-center rounded"
                    :style="{
                        backgroundColor: badgeBackground,
                        color: badgeColor
                    }"
                >
                    <Icon :name="row.icon" class="size-4" />
                </span>
                <div class="flex min-w-0 flex-col gap-1">
                    <span
                        class="flex items-center gap-1.5 text-sm text-surface-950"
                    >
                        <Icon
                            name="tabler:truck"
                            class="size-4.5 shrink-0 text-surface-700"
                        />
                        {{ row.label }}
                    </span>
                    <span
                        class="flex items-center gap-1.5 text-sm text-surface-700"
                    >
                        <Icon name="tabler:user" class="size-4.5 shrink-0" />
                        {{ row.driverName ?? '—' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Expand / collapse the truncated lists -->
        <button
            v-if="hasHiddenItems"
            type="button"
            class="flex cursor-pointer items-center justify-center gap-1 self-center text-sm text-surface-800 transition-colors hover:text-surface-950"
            @click="listExpanded = !listExpanded"
        >
            {{
                listExpanded
                    ? $t('zones.list.collapse')
                    : $t('zones.list.expand')
            }}
            <Icon
                :name="
                    listExpanded ? 'tabler:chevron-up' : 'tabler:chevron-down'
                "
                class="size-4"
            />
        </button>
    </div>
</template>

<script lang="ts">
import type { Zone } from '~/types/zone';
import { ZONE_TRIGGER_ICONS } from '~/constants/zones';
import { primitiveColors } from '~/theme/colors';

/** Group binding chip of the summary */
interface ZoneGroupChip {
    key: string;
    /** Trigger icon of the binding */
    icon: string;
    /** Group display name */
    name: string;
    /** Chip background derived from the group color */
    background: string;
    /** Chip text/icon color derived from the group color */
    color: string;
}

/** Individual vehicle row of the summary */
interface ZoneVehicleRow {
    key: string;
    /** Trigger icon of the binding */
    icon: string;
    /** Vehicle label, e.g. "MAN TGX 18.480 (ID: TRK-112)" */
    label: string;
    /** Assigned driver name; null when the vehicle has no driver */
    driverName: string | null;
}

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

/** Trigger badge background derived from the zone color */
const badgeBackground = computed<string>(
    () => primitiveColors[props.zone.color]['200']
);

/** Trigger badge text color derived from the zone color */
const badgeColor = computed<string>(
    () => primitiveColors[props.zone.color]['700']
);

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
