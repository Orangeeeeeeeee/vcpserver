<template>
    <NuxtLink
        :to="to"
        class="flex items-center gap-3 px-4 rounded-md transition-colors duration-150"
        :class="[
            active
                ? 'bg-[var(--p-primary-900)] text-[var(--p-surface-50)]'
                : 'text-[var(--p-surface-500)] hover:bg-[var(--p-primary-900)] hover:text-[var(--p-surface-50)]',
            collapsed ? 'justify-center py-3' : 'py-3.5'
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
defineProps<{
    icon: string;
    label: string;
    to: string;
    active: boolean;
    collapsed: boolean;
}>();
</script>
