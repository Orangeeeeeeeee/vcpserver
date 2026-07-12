<template>
    <div>
        <button
            type="button"
            :aria-expanded="isPeriodOpen"
            aria-haspopup="dialog"
            class="h-[2.5rem] w-40 md:w-56 flex cursor-pointer items-center justify-between gap-2 rounded-md border border-surface-300 px-3 text-sm transition duration-300 hover:border-primary-300 aria-expanded:border-primary-300"
            @click="togglePeriodPopover"
        >
            <span class="truncate text-surface-950">
                {{ selectedPeriodLabel }}
            </span>
            <Icon
                name="tabler:chevron-down"
                class="size-6 shrink-0 text-surface-600 transition-transform"
            />
        </button>

        <Popover
            ref="periodPopoverRef"
            @show="isPeriodOpen = true"
            @hide="isPeriodOpen = false"
        >
            <div class="flex flex-col gap-3 w-64">
                <div class="grid grid-cols-3 gap-2">
                    <Button
                        v-for="option in periodShortOptions"
                        :key="option.value"
                        :label="option.shortLabel"
                        size="small"
                        severity="secondary"
                        @click="onSelectPeriod(option.value)"
                    />
                </div>
                <div class="flex items-center gap-2">
                    <DatePicker
                        v-model="customFrom"
                        size="small"
                        :manual-input="false"
                        :placeholder="$t('calendar.from')"
                        class="w-full"
                    />
                    <span class="text-surface-600">–</span>
                    <DatePicker
                        v-model="customTo"
                        size="small"
                        :manual-input="false"
                        :placeholder="$t('calendar.to')"
                        class="w-full"
                    />
                </div>
            </div>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover';
import type { PassengerFlowPeriod } from '~/composables/usePassengerFlow';

const { t } = useI18n();
const { selectedPeriod, customRange } = usePassengerFlowPeriodFilter();

const periodPopoverRef = ref<InstanceType<typeof Popover> | null>(null);

/** Whether the period popover is currently open (drives the trigger arrow rotation) */
const isPeriodOpen = ref<boolean>(false);

/** Full labels shown on the trigger for each fixed time period */
const periodFullLabels = computed<
    Record<Exclude<PassengerFlowPeriod, 'custom'>, string>
>(() => ({
    '1h': t('calendar.hour1'),
    '8h': t('calendar.hours8'),
    '24h': t('calendar.hours24'),
    '3d': t('calendar.days3'),
    '7d': t('calendar.week'),
    all: t('calendar.all')
}));

/** Short-label options listed inside the popover */
const periodShortOptions = computed<
    { shortLabel: string; value: PassengerFlowPeriod }[]
>(() => [
    { shortLabel: t('calendar.hour1Short'), value: '1h' },
    { shortLabel: t('calendar.hours8Short'), value: '8h' },
    { shortLabel: t('calendar.hours24Short'), value: '24h' },
    { shortLabel: t('calendar.days3Short'), value: '3d' },
    { shortLabel: t('calendar.weekShort'), value: '7d' },
    { shortLabel: t('calendar.allShort'), value: 'all' }
]);

/** Label shown on the trigger element for the currently selected period */
const selectedPeriodLabel = computed<string>(() => {
    if (selectedPeriod.value === 'custom') {
        const [from, to] = customRange.value;
        if (from && to) return `${formatUaDate(from)} - ${formatUaDate(to)}`;
    }
    return (
        periodFullLabels.value[
            selectedPeriod.value as Exclude<PassengerFlowPeriod, 'custom'>
        ] ?? ''
    );
});

const togglePeriodPopover = (event: MouseEvent): void => {
    periodPopoverRef.value?.toggle(event);
};

/** Apply the selected fixed period and close the popover */
const onSelectPeriod = (value: PassengerFlowPeriod): void => {
    selectedPeriod.value = value;
    customRange.value = [null, null];
    periodPopoverRef.value?.hide();
};

/** Custom range start, synced with the shared composable state */
const customFrom = computed<Date | null>({
    get: () => customRange.value[0],
    set: (value) => {
        customRange.value = [value, customRange.value[1]];
        if (value && customRange.value[1]) selectedPeriod.value = 'custom';
    }
});

/** Custom range end, synced with the shared composable state */
const customTo = computed<Date | null>({
    get: () => customRange.value[1],
    set: (value) => {
        customRange.value = [customRange.value[0], value];
        if (customRange.value[0] && value) selectedPeriod.value = 'custom';
    }
});
</script>
