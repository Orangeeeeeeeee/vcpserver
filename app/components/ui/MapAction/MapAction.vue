<template>
    <button
        type="button"
        class="flex cursor-pointer items-center justify-center bg-surface-100 text-surface-800 transition-colors hover:bg-surface-200"
        :class="frameClass"
    >
        <Icon :name="icon" class="size-5 shrink-0" />
    </button>
</template>

<script setup lang="ts">
import { MAP_ACTION_GROUP } from './context';

interface MapActionProps {
    /** Tabler icon name (e.g. `tabler:search`) */
    icon: string;
}

defineProps<MapActionProps>();

/** Group orientation when nested in a MapActionGroup, otherwise null */
const group = inject(MAP_ACTION_GROUP, null);

/**
 * Sizing + frame classes. Standalone actions are square with their own frame;
 * grouped actions keep only the group's main-axis size and stretch across it, so
 * the group's border doesn't make the stack wider than a single action.
 */
const frameClass = computed<string>(() => {
    if (!group) return 'size-10 rounded-md border border-surface-300 shadow-sm';
    return group === 'vertical' ? 'h-10' : 'w-10';
});
</script>
