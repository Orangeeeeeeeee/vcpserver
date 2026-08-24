<template>
    <NuxtLink
        :to="to"
        class="flex items-center gap-3 py-3 px-4 md:px-3 rounded-md transition-colors duration-150"
        :class="[
            active
                ? 'bg-primary-900 dark:bg-primary-700 text-surface-50 dark:text-surface-100'
                : 'text-surface-500 hover:bg-primary-900 dark:hover:bg-primary-700 hover:text-surface-50'
        ]"
    >
        <Icon :name="icon" class="size-6 shrink-0" />
        <span
            v-if="!collapsed"
            class="text-base font-medium whitespace-nowrap overflow-hidden text-inherit"
        >
            {{ label }}
        </span>
    </NuxtLink>
</template>

<script setup lang="ts">
interface SidebarNavItemProps {
    /** Icon name (Iconify format) */
    icon: string;
    /** Display label */
    label: string;
    /** Route path */
    to: string;
    /** Whether this item is currently active */
    active: boolean;
    /** Whether the sidebar is collapsed */
    collapsed: boolean;
}

defineProps<SidebarNavItemProps>();
</script>
