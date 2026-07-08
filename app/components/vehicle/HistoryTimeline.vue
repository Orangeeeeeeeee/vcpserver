<template>
    <div class="select-none">
        <!-- Track with event badges; the whole strip is draggable -->
        <div
            ref="trackRef"
            class="relative h-12 cursor-pointer touch-none"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
        >
            <!-- Event badges above their segments -->
            <span
                v-for="segment in history.segments"
                :key="segment.id"
                class="absolute top-0 flex size-7 -translate-x-1/2 items-center justify-center rounded-md border bg-surface-0"
                :class="
                    segment.type === 'idleEngine'
                        ? 'border-yellow-400 text-yellow-500'
                        : 'border-red-400 text-red-500'
                "
                :style="{
                    left: `${((segment.start + segment.end) / 2) * 100}%`
                }"
            >
                <Icon
                    :name="
                        segment.type === 'idleEngine'
                            ? 'tabler:engine'
                            : 'tabler:send'
                    "
                    class="size-4"
                />
            </span>

            <!-- Base track -->
            <div
                class="absolute inset-x-0 bottom-2 h-1 rounded-full bg-surface-300"
            />

            <!-- Colored event segments -->
            <div
                v-for="segment in history.segments"
                :key="`bar-${segment.id}`"
                class="absolute bottom-1.5 h-2 rounded-full"
                :class="
                    segment.type === 'idleEngine'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                "
                :style="{
                    left: `${segment.start * 100}%`,
                    width: `${(segment.end - segment.start) * 100}%`
                }"
            />

            <!-- Cursor -->
            <span
                class="absolute bottom-0 size-4.5 -translate-x-1/2 rounded-full border-2 border-primary-400 bg-surface-0 shadow"
                :style="{ left: `${cursor * 100}%` }"
            />
        </div>

        <!-- Period labels: start / middle / end -->
        <div
            class="mt-1.5 flex items-center justify-between text-xs text-surface-600"
        >
            <span>{{ rangeLabels[0] }}</span>
            <span>{{ rangeLabels[1] }}</span>
            <span>{{ rangeLabels[2] }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useVehicleHistoryContext } from '~/composables/useVehicleHistory';

/**
 * History playback timeline: the period track with colored event stretches,
 * badge icons above them and a draggable cursor. Used both as the slim bar
 * under the map and inside the telemetry panel.
 */

const { history, cursor, rangeLabels } = useVehicleHistoryContext();

const trackRef = useTemplateRef<HTMLDivElement>('trackRef');

/** Whether a drag is in progress (pointer captured by the track) */
const dragging = ref<boolean>(false);

/** Converts a pointer event into a 0..1 fraction of the track width */
const fractionAt = (event: PointerEvent): number => {
    const rect = trackRef.value?.getBoundingClientRect();
    if (!rect || !rect.width) return cursor.value;
    return Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
};

const onPointerDown = (event: PointerEvent): void => {
    dragging.value = true;
    trackRef.value?.setPointerCapture(event.pointerId);
    cursor.value = fractionAt(event);
};

const onPointerMove = (event: PointerEvent): void => {
    if (!dragging.value) return;
    cursor.value = fractionAt(event);
};

const onPointerUp = (event: PointerEvent): void => {
    dragging.value = false;
    trackRef.value?.releasePointerCapture(event.pointerId);
};
</script>
