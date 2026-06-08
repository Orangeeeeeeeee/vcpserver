<template>
    <button
        class="absolute flex items-center justify-center cursor-pointer size-10"
        :class="positionClass"
        @click="$emit('click')"
    >
        <Icon :name="iconName" class="size-6 text-surface-300" />
    </button>
</template>

<script setup lang="ts">
interface SidebarToggleButtonProps {
    /** Button mode: 'toggle' for desktop collapse, 'close' for mobile drawer */
    mode: 'toggle' | 'close';
    /** Whether the sidebar is collapsed */
    collapsed?: boolean;
    /** Whether the sidebar is positioned on the right side */
    isRight?: boolean;
}

interface SidebarToggleButtonEmits {
    (e: 'click'): void;
}

const props = withDefaults(defineProps<SidebarToggleButtonProps>(), {
    collapsed: false,
    isRight: false
});

defineEmits<SidebarToggleButtonEmits>();

/** Resolved icon name based on mode, collapsed and sidebar-position state */
const iconName = computed((): string => {
    if (props.mode === 'close') return 'tabler:x';
    if (props.isRight) {
        return props.collapsed ? 'tabler:chevron-left' : 'tabler:chevron-right';
    }
    return props.collapsed ? 'tabler:chevron-right' : 'tabler:chevron-left';
});

/** Position classes — toggle (desktop) flips with `isRight`; close (mobile) stays right */
const positionClass = computed((): string => {
    if (props.mode === 'close') {
        return 'top-5 right-4 text-surface-500';
    }
    return props.isRight
        ? 'top-2/4 left-0 -translate-x-1/2 -translate-y-1/2 h-15.5 w-4 rounded-lg bg-surface-950 text-surface-300'
        : 'top-2/4 right-0 translate-x-1/2 -translate-y-1/2 h-15.5 w-4 rounded-lg bg-surface-950 text-surface-300';
});
</script>
