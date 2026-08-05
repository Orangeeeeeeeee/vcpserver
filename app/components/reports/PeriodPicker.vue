<template>
    <DatePicker
        v-model="value"
        selection-mode="range"
        :manual-input="false"
        hide-on-range-selection
        show-icon
        icon-display="input"
        fluid
        :placeholder="$t('reports.idle.filters.periodPlaceholder')"
        :pt="{
            // !important classes beat the inline width PrimeVue freezes on
            // open (it measures the single-line max-content of the header)
            panel: { class: '!w-[21.5rem] !min-w-0' },
            // The #header slot renders inside the nav row; wrap pushes the
            // full-width range inputs below the ‹ month year › controls
            header: { class: 'flex-wrap gap-y-3' }
        }"
    >
        <template #inputicon="{ clickCallback }">
            <Icon
                name="tabler:calendar-event"
                class="size-5 shrink-0 text-surface-600"
                @click="clickCallback"
            />
        </template>
        <template #header>
            <div
                class="order-last grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2"
            >
                <InputText
                    :value="startLabel"
                    readonly
                    fluid
                    class="min-w-0"
                    size="small"
                    :placeholder="$t('reports.idle.filters.startPlaceholder')"
                />
                <span class="text-surface-600">–</span>
                <InputText
                    :value="endLabel"
                    readonly
                    fluid
                    class="min-w-0"
                    size="small"
                    :placeholder="$t('reports.idle.filters.endPlaceholder')"
                />
            </div>
        </template>
    </DatePicker>
</template>

<script setup lang="ts">
import { formatUaDate } from '~/utils/date';

/** Range model: PrimeVue emits [start, null] mid-selection, [start, end] when done */
const value = defineModel<Date[] | null>('value', { default: null });

/** Display value of the range start */
const startLabel = computed<string>(() =>
    value.value?.[0] ? formatUaDate(value.value[0]) : ''
);

/** Display value of the range end */
const endLabel = computed<string>(() =>
    value.value?.[1] ? formatUaDate(value.value[1]) : ''
);
</script>
