<template>
    <div>
        <button
            type="button"
            :aria-expanded="isOpen"
            aria-haspopup="dialog"
            class="h-[2.5rem] w-full flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-surface-300 px-3 text-sm transition duration-300 hover:border-primary-300 aria-expanded:border-primary-300"
            @click="toggle"
        >
            <span class="flex min-w-0 items-center gap-2">
                <Icon
                    name="tabler:calendar-event"
                    class="size-5 shrink-0 text-surface-600"
                />
                <span
                    class="truncate"
                    :class="label ? 'text-surface-950' : 'text-surface-500'"
                >
                    {{
                        label || $t('reports.idle.filters.periodPlaceholder')
                    }}
                </span>
            </span>
            <Icon
                name="tabler:chevron-down"
                class="size-4 shrink-0 text-surface-600 transition-transform"
                :class="isOpen ? 'rotate-180' : ''"
            />
        </button>

        <Popover
            ref="popoverRef"
            @show="isOpen = true"
            @hide="isOpen = false"
        >
            <DatePicker
                v-model="value"
                selection-mode="range"
                inline
                :manual-input="false"
            >
                <template #header>
                    <div
                        class="mb-2 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-surface-300 pb-3"
                    >
                        <InputText
                            :value="startLabel"
                            readonly
                            size="small"
                            :placeholder="
                                $t('reports.idle.filters.startPlaceholder')
                            "
                        />
                        <span class="text-surface-600">–</span>
                        <InputText
                            :value="endLabel"
                            readonly
                            size="small"
                            :placeholder="
                                $t('reports.idle.filters.endPlaceholder')
                            "
                        />
                    </div>
                </template>
            </DatePicker>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover';
import { formatUaDate } from '~/utils/date';

/** Range model: PrimeVue emits [start, null] mid-selection, [start, end] when done */
const value = defineModel<Date[] | null>('value', { default: null });

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

/** Whether the picker popover is currently open (drives the active button styles) */
const isOpen = ref<boolean>(false);

const toggle = (event: MouseEvent): void => {
    popoverRef.value?.toggle(event);
};

/** Display value of the range start */
const startLabel = computed<string>(() =>
    value.value?.[0] ? formatUaDate(value.value[0]) : ''
);

/** Display value of the range end */
const endLabel = computed<string>(() =>
    value.value?.[1] ? formatUaDate(value.value[1]) : ''
);

/** Trigger label: "09.03.2026 - 20.03.2026" (or "start - …" mid-selection) */
const label = computed<string>(() => {
    if (!startLabel.value) return '';
    return `${startLabel.value} - ${endLabel.value || '…'}`;
});

/** Close the popover once both range ends are picked */
watch(value, (next): void => {
    if (next?.[0] && next?.[1]) {
        popoverRef.value?.hide();
    }
});
</script>
