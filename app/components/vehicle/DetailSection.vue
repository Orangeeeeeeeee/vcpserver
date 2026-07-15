<template>
    <section>
        <h5 class="mb-2 font-semibold text-surface-900 text-sm md:text-base">
            {{ title }}
        </h5>
        <div
            class="rounded-md border border-surface-300 p-3"
            :class="rows.length > collapsedCount ? 'pb-1' : ''"
        >
            <SharedAnimatedHeight>
                <div
                    v-for="(row, i) in shownRows"
                    :key="`${row.label}-${i}`"
                    class="flex items-center justify-between gap-4 border-b border-surface-200 py-1.5 last:border-b-0 first:pt-0 last:pb-0"
                >
                    <span class="text-xs text-surface-700">
                        {{ row.label }}
                    </span>
                    <span
                        class="text-sm font-medium text-surface-900 text-right"
                    >
                        {{ row.value }}
                    </span>
                </div>

                <button
                    v-if="rows.length > collapsedCount"
                    type="button"
                    class="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-surface-200 px-3.5 py-1.5 text-sm font-medium text-surface-800 transition-colors hover:text-surface-950"
                    @click="expanded = !expanded"
                >
                    {{
                        expanded
                            ? $t('objects.vehicles.detail.collapse')
                            : $t('objects.vehicles.detail.expand')
                    }}
                    <Icon
                        :name="
                            expanded
                                ? 'tabler:chevron-up'
                                : 'tabler:chevron-down'
                        "
                        class="size-5"
                    />
                </button>
            </SharedAnimatedHeight>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { OnlineDetailEntry } from '~/types/online';

/**
 * Collapsible label→value section card of the vehicle detail panel
 * (day stats / telemetry / additional data).
 */

interface DetailSectionProps {
    /** Section heading shown above the card */
    title: string;
    rows: OnlineDetailEntry[];
    /** Rows visible while collapsed */
    collapsedCount?: number;
}

const props = withDefaults(defineProps<DetailSectionProps>(), {
    collapsedCount: 3
});

/** Whether all rows are shown */
const expanded = ref<boolean>(false);

/** Rows visible in the current state */
const shownRows = computed<OnlineDetailEntry[]>(() =>
    expanded.value ? props.rows : props.rows.slice(0, props.collapsedCount)
);
</script>
