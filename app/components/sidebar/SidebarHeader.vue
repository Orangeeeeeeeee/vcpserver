<template>
    <div
        class="flex py-5 px-4 md:pt-8 md:pb-6 md:px-5 items-center border-b border-b-[var(--p-surface-900)]"
        :class="collapsed ? 'justify-center' : 'gap-4'"
    >
        <div class="size-8 rounded-md bg-primary-300 shrink-0" />
        <span
            v-if="!collapsed"
            class="text-white font-semibold text-xl truncate"
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
