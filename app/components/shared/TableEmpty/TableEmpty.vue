<template>
    <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[var(--p-surface-200)] rounded-md p-3"
    >
        <div class="flex items-center gap-2 min-w-0">
            <Icon
                :name="icon ?? 'tabler:zoom-question'"
                class="size-6 text-[var(--p-surface-700)] shrink-0"
            />
            <span class="text-sm text-[var(--p-surface-900)]">
                {{ message }}
            </span>
        </div>
        <Button
            v-if="resetLabel"
            :label="resetLabel"
            severity="secondary"
            class="shrink-0"
            @click="$emit('reset')"
        />
    </div>
</template>

<script setup lang="ts">
interface TableEmptyProps {
    /** Main message text */
    message: string;
    /** Optional reset button label; button is omitted when not provided */
    resetLabel?: string;
    /** Optional Iconify name; defaults to a magnifier with a question mark */
    icon?: string;
}

defineProps<TableEmptyProps>();

defineEmits<{
    reset: [];
}>();
</script>
