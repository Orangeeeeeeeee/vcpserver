<template>
    <div class="flex flex-col gap-5">
        <SharedAppFormField
            id="grpVehicles"
            name="vehicles"
            :label="$t('objects.groups.modal.vehicles')"
        >
            <UiMultiSelect
                id="grpVehicles"
                v-model="selectedVehicleIds"
                :options="vehicleOptions"
                option-label="label"
                option-value="value"
                display="chip"
                filter
                :placeholder="$t('objects.groups.modal.vehiclesPlaceholder')"
                fluid
                show-select-all
            />
        </SharedAppFormField>

        <ul v-if="state.vehicles.length" class="flex flex-col">
            <li
                v-for="(vehicle, index) in state.vehicles"
                :key="vehicle.transportId"
                draggable="true"
                class="flex items-center gap-2 border-b border-surface-200 py-2 last:border-none"
                :class="dragIndex === index ? 'opacity-50' : ''"
                @dragstart="onDragStart(index, $event)"
                @dragover.prevent="onDragOver(index)"
                @drop.prevent
                @dragend="onDragEnd"
            >
                <Icon
                    name="tabler:grip-vertical"
                    class="size-5 shrink-0 cursor-grab text-surface-500"
                />
                <Icon
                    :name="VEHICLE_TYPE_ICONS[vehicle.type]"
                    class="size-5 shrink-0 text-surface-600"
                />
                <span class="flex-1 md:truncate text-sm text-surface-900" :title="`${vehicle.transport} (ID: ${vehicle.transportId})`">
                    {{ vehicle.transport }} (ID: {{ vehicle.transportId }})
                </span>
                <button
                    type="button"
                    class="shrink-0 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                    :aria-label="$t('common.delete')"
                    @click="removeVehicle(index)"
                >
                    <Icon name="tabler:trash" class="size-5" />
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useGroupFormContext } from '~/composables/useGroupForm';
import { VEHICLE_TYPE_ICONS } from '~/components/objects/GroupCard.vue';

const { state, vehicleOptions, selectedVehicleIds, removeVehicle } =
    useGroupFormContext();

/** Index of the row being dragged; null when no drag is in progress */
const dragIndex = ref<number | null>(null);

/** Starts a native drag for the row at the given index */
const onDragStart = (index: number, event: DragEvent): void => {
    dragIndex.value = index;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        // Firefox refuses to start a drag without data
        event.dataTransfer.setData('text/plain', String(index));
    }
};

/** Live-reorders the list while hovering — the dragged row follows the cursor */
const onDragOver = (index: number): void => {
    const from = dragIndex.value;
    if (from === null || from === index) {
        return;
    }
    const moved = state.vehicles.splice(from, 1)[0];

    if (moved) {
        state.vehicles.splice(index, 0, moved);
    }

    dragIndex.value = index;
};

/** Clears the drag state once the drag finishes */
const onDragEnd = (): void => {
    dragIndex.value = null;
};
</script>
