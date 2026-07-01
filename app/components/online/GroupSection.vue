<template>
    <div class="shrink-0 overflow-hidden rounded-lg border border-surface-300">
        <!-- Header (tinted by the group color) -->
        <div
            class="flex flex-col gap-1 px-3 py-2.5"
            :style="{ backgroundColor: headerBg }"
        >
            <div class="flex items-center justify-between gap-2">
                <button
                    type="button"
                    class="flex min-w-0 cursor-pointer items-center gap-1.5 font-semibold text-surface-950"
                    :aria-expanded="state.expanded"
                    @click="state.expanded = !state.expanded"
                >
                    <Icon
                        :name="
                            state.expanded
                                ? 'tabler:chevron-up'
                                : 'tabler:chevron-down'
                        "
                        class="size-4 shrink-0 text-surface-700"
                    />
                    <span class="truncate">{{ group.name }}</span>
                </button>
                <span
                    class="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium"
                    :style="{ backgroundColor: badgeBg, color: badgeColor }"
                >
                    {{ count }}
                </span>
            </div>
            <div class="flex items-center justify-between gap-2">
                <span class="text-sm text-surface-800">
                    {{ $t('objects.online.group.showOnMap') }}
                </span>
                <ToggleSwitch v-model="state.visible" />
            </div>
            <p
                v-if="state.expanded && group.description"
                class="text-xs/tight text-surface-700"
            >
                {{ group.description }}
            </p>
        </div>

        <!-- Vehicles -->
        <div v-if="state.expanded" class="divide-y divide-surface-200">
            <OnlineVehicleCard
                v-for="vehicle in vehicles"
                :key="vehicle.id"
                :vehicle="vehicle"
            />
            <p
                v-if="!vehicles.length"
                class="px-3 py-3 text-sm text-surface-600"
            >
                {{ $t('objects.online.group.empty') }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { OnlineGroup, OnlineVehicle } from '~/types/online';
import {
    useOnlineFleetContext,
    type OnlineGroupState
} from '~/composables/useOnlineFleet';
import { primitiveColors } from '~/theme/colors';

interface GroupSectionProps {
    group: OnlineGroup;
    /** Vehicles after search/status filters */
    vehicles: OnlineVehicle[];
    /** Total vehicle count of the group (header badge) */
    count: number;
}

const props = defineProps<GroupSectionProps>();

const { groupState } = useOnlineFleetContext();

/** Shared per-group UI state (visible/expanded) from the fleet context */
const state = computed<OnlineGroupState>(() => groupState[props.group.id]!);

/** Pastel header tint derived from the group color */
const headerBg = computed<string>(
    () => primitiveColors[props.group.color]['100']
);

/** Count badge colors derived from the group color */
const badgeBg = computed<string>(
    () => primitiveColors[props.group.color]['200']
);
const badgeColor = computed<string>(
    () => primitiveColors[props.group.color]['800']
);
</script>
