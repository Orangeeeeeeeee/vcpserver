<template>
    <div class="flex flex-col gap-5">
        <SharedAppFormField
            id="rtGrpRoutes"
            name="routes"
            :label="$t('routes.groups.modal.routes')"
        >
            <MultiSelect
                id="rtGrpRoutes"
                v-model="selectedRouteIds"
                :options="routeOptions"
                option-label="label"
                option-value="value"
                display="chip"
                filter
                :placeholder="$t('routes.groups.modal.routesPlaceholder')"
                fluid
            >
                <template #chipicon="{ removeCallback }">
                    <Icon
                        name="tabler:x"
                        class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                        @click="removeCallback"
                    />
                </template>
            </MultiSelect>
        </SharedAppFormField>

        <ul v-if="state.routeIds.length" class="flex flex-col">
            <li
                v-for="(routeId, index) in state.routeIds"
                :key="routeId"
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
                <span class="flex-1 truncate text-sm text-surface-900">
                    {{ routeNameOf(routeId) }}
                </span>
                <button
                    type="button"
                    class="shrink-0 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                    :aria-label="$t('common.delete')"
                    @click="removeRoute(index)"
                >
                    <Icon name="tabler:trash" class="size-5" />
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useRouteGroupFormContext } from '~/composables/useRouteGroupForm';

const { state, routeOptions, routeNameOf, selectedRouteIds, removeRoute } =
    useRouteGroupFormContext();

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
    const moved = state.routeIds.splice(from, 1)[0];

    if (moved) {
        state.routeIds.splice(index, 0, moved);
    }

    dragIndex.value = index;
};

/** Clears the drag state once the drag finishes */
const onDragEnd = (): void => {
    dragIndex.value = null;
};
</script>
