<template>
    <div class="flex flex-col gap-1.5">
        <label
            :for="id"
            class="text-sm font-normal text-[var(--p-surface-700)]"
        >
            {{ label }}
        </label>
        <slot />
        <Message v-if="error" severity="error" size="small" variant="simple">
            {{ $t(error) }}
        </Message>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
    label: string;
    id?: string;
    error?: string;
}>();
</script>
