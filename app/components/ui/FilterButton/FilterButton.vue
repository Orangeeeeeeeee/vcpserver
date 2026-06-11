<template>
    <button
        type="button"
        :aria-expanded="expanded"
        class="group h-[2.5rem] flex justify-center items-center gap-2 px-4 text-sm border border-surface-300 rounded-lg cursor-pointer transition duration-300 hover:border-primary-300 aria-expanded:border-primary-300 w-full"
        @click="emit('click', $event)"
    >
        <Icon
            name="tabler:filter-2"
            class="size-5 text-surface-700 transition-colors group-hover:text-primary-600 group-aria-expanded:text-primary-600"
        />
        <span
            class="shrink-0 text-surface-800 transition-colors group-hover:text-primary-600 group-aria-expanded:text-primary-600"
        >
            {{ label }}
        </span>
        <Badge v-if="badge > 0" :value="badge" />
    </button>
</template>

<script setup lang="ts">
interface FilterButtonProps {
    /** Already-translated button label, e.g. "Фільтр" */
    label: string;
    /** Active filter count shown as a badge; hidden when 0 */
    badge?: number;
    /** True while the attached filter popover is open (keeps hover styles on) */
    expanded?: boolean;
}

withDefaults(defineProps<FilterButtonProps>(), {
    badge: 0,
    expanded: false
});

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();
</script>
