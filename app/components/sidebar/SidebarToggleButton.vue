<template>
    <button
        class="absolute flex items-center justify-center cursor-pointer size-10"
        :class="
            mode === 'close'
                ? 'top-5 right-4 text-[var(--p-surface-500)]'
                : 'top-2/4 right-0 translate-x-1/2 -translate-y-1/2 h-15.5 w-4 rounded-lg bg-[var(--p-surface-950)] text-[var(--p-surface-300)]'
        "
        @click="$emit('click')"
    >
        <Icon :name="iconName" class="size-6 text-[var(--p-surface-300)]" />
    </button>
</template>

<script setup lang="ts">
interface SidebarToggleButtonProps {
    /** Button mode: 'toggle' for desktop collapse, 'close' for mobile drawer */
    mode: 'toggle' | 'close';
    /** Whether the sidebar is collapsed */
    collapsed?: boolean;
}

interface SidebarToggleButtonEmits {
    (e: 'click'): void;
}

const props = withDefaults(defineProps<SidebarToggleButtonProps>(), {
    collapsed: false
});

defineEmits<SidebarToggleButtonEmits>();

/** Resolved icon name based on mode and collapsed state */
const iconName = computed((): string => {
    if (props.mode === 'close') return 'tabler:x';
    return props.collapsed ? 'tabler:chevron-right' : 'tabler:chevron-left';
});
</script>
