<template>
    <div
        class="flex py-5 px-4 md:p-5 items-center border-b border-b-[var(--p-surface-800)]"
        :class="collapsed ? 'justify-center' : 'gap-3'"
    >
        <div class="size-8 rounded-md bg-[var(--p-primary-300)] shrink-0" />
        <span
            v-if="!collapsed"
            class="text-white font-semibold text-sm truncate"
        >
            Logotype
        </span>
    </div>
</template>

<script setup lang="ts">
interface SidebarHeaderProps {
    /** Whether the sidebar is collapsed */
    collapsed: boolean;
}

defineProps<SidebarHeaderProps>();
</script>
