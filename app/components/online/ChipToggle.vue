<template>
    <Chip
        :label="expanded ? $t('objects.online.lessChips') : $t('objects.online.moreChips', { n: count })"
        class="cursor-pointer bg-surface-300 text-surface-800"
        @click="expanded = !expanded"
    >
        <template #icon>
            <Icon
                :name="expanded ? 'tabler:chevron-up' : 'tabler:plus'"
                class="size-3"
            />
        </template>
    </Chip>
</template>

<script setup lang="ts">
interface ChipToggleProps {
    /** Number of hidden chips shown in the collapsed label */
    count: number;
}

defineProps<ChipToggleProps>();

/** Whether the chip row is fully expanded (two-way bound) */
const expanded = defineModel<boolean>({ default: false });
</script>
