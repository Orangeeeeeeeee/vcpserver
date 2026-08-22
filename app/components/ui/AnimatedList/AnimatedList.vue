<script lang="ts">
/** Item shape required for the built-in default card (no custom slot). */
export interface AnimatedListItem {
    id: string | number;
    title: string;
}
</script>

<script setup lang="ts" generic="T extends object">
interface AnimatedListProps {
    items: T[];
    /**
     * Returns the stable TransitionGroup key for each item.
     * Defaults to `(item as AnimatedListItem).id`.
     * Pass this when `id` is not the unique row identifier.
     */
    getKey?: (item: T) => string | number;
}

const props = defineProps<AnimatedListProps>();

const emit = defineEmits<{
    /** Emitted by the built-in delete button (when no default slot is provided). */
    remove: [id: string | number];
}>();

const { t } = useI18n();

const resolveKey = (item: T): string | number => {
    if (props.getKey) return props.getKey(item);
    return (item as AnimatedListItem).id;
};
</script>

<template>
    <TransitionGroup
        tag="ul"
        name="animated-list-item"
        class="m-0 list-none p-0"
    >
        <li
            v-for="(item, index) in items"
            :key="resolveKey(item)"
            class="mb-3 grid grid-rows-[1fr] last:mb-0"
        >
            <div class="min-h-0 overflow-hidden">
                <slot v-if="$slots.default" :item="item" :index="index" />
                <div
                    v-else
                    class="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 shadow-sm"
                >
                    <span class="flex-1 text-sm text-surface-900">{{ (item as AnimatedListItem).title }}</span>
                    <button
                        type="button"
                        class="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-900"
                        :aria-label="`${t('common.delete')} ${(item as AnimatedListItem).title}`"
                        @click="emit('remove', resolveKey(item))"
                    >
                        <Icon name="tabler:trash" class="size-4" />
                    </button>
                </div>
            </div>
        </li>
    </TransitionGroup>
</template>

<style scoped>
/* Duration: 220ms — update both transition shorthand values if changing */
.animated-list-item-enter-active {
    transition:
        grid-template-rows 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
        margin-bottom 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.animated-list-item-leave-active {
    transition:
        grid-template-rows 220ms ease-in,
        opacity 220ms ease-in,
        margin-bottom 220ms ease-in;
}

/*
 * Scoped selector specificity [0,2,0] beats Tailwind grid-rows-[1fr] / mb-3
 * [0,1,0], so the collapsed state wins without !important.
 */
.animated-list-item-enter-from,
.animated-list-item-leave-to {
    grid-template-rows: 0fr;
    opacity: 0;
    margin-bottom: 0;
}

@media (prefers-reduced-motion: reduce) {
    .animated-list-item-enter-active,
    .animated-list-item-leave-active {
        transition: none;
    }
}
</style>
