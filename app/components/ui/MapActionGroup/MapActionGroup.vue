<template>
    <div
        class="inline-flex overflow-hidden rounded-md border border-surface-300 shadow-sm"
        :class="
            orientation === 'horizontal'
                ? 'h-10 flex-row divide-x divide-surface-300'
                : 'w-10 flex-col divide-y divide-surface-300'
        "
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import {
    MAP_ACTION_GROUP,
    type MapActionOrientation
} from '../MapAction/context';

interface MapActionGroupProps {
    /** Stacking direction of the grouped actions */
    orientation?: MapActionOrientation;
}

const props = withDefaults(defineProps<MapActionGroupProps>(), {
    orientation: 'vertical'
});

// Nested MapActions size to this group and drop their own frame
provide(MAP_ACTION_GROUP, props.orientation);
</script>
