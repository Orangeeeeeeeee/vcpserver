<template>
    <div
        class="flex flex-col gap-4 bg-surface-200 rounded-md p-3"
        :class="layout === 'row' ? 'md:flex-row md:items-center md:justify-between' : ''"
    >
        <div class="flex items-center gap-2 min-w-0">
            <Icon
                :name="icon ?? 'tabler:zoom-question'"
                class="size-6 text-surface-700 shrink-0"
            />
            <span class="text-sm text-surface-900">
                {{ message }}
            </span>
        </div>
        <div
            class="shrink-0"
            :class="layout === 'row' ? 'shrink-0' : 'shrink grow-0'"
        >
            <Button
                v-if="resetLabel"
                :label="resetLabel"
                severity="secondary"
                :class="layout === 'row' ? 'w-full' : ''"
                @click="buttonAction"
            />
        </div>

    </div>
</template>

<script setup lang="ts">
interface EmptyProps {
    /** Main message text */
    message: string;
    /** Optional reset button label; button is omitted when not provided */
    resetLabel?: string;
    /** Optional Iconify name; defaults to a magnifier with a question mark */
    icon?: string;
    layout?: 'col' | 'row';
    /** Called when the reset button is clicked */
    buttonAction?: () => void;
}

withDefaults(defineProps<EmptyProps>(), { layout: 'row' });
</script>
