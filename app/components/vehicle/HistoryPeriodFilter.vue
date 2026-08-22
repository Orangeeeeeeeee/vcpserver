<template>
    <div class="min-w-0 flex-1">
        <button
            type="button"
            :aria-expanded="isOpen"
            aria-haspopup="dialog"
            class="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-surface-300 px-3 text-sm transition duration-300 hover:border-primary-300 aria-expanded:border-primary-300"
            @click="togglePopover"
        >
            <span class="flex min-w-0 items-center gap-2">
                <Icon
                    name="tabler:calendar-event"
                    class="size-5 shrink-0 text-surface-600"
                />
                <span
                    class="md:truncate"
                    :class="
                        triggerLabel ? 'text-surface-950' : 'text-surface-500'
                    "
                    :title="
                        triggerLabel ||
                        $t('objects.vehicles.detail.history.period.placeholder')
                    "
                >
                    {{
                        triggerLabel ||
                        $t('objects.vehicles.detail.history.period.placeholder')
                    }}
                </span>
            </span>
            <Icon
                :name="isOpen ? 'tabler:chevron-up' : 'tabler:chevron-down'"
                class="size-5 shrink-0 text-surface-600"
            />
        </button>

        <Popover
            ref="popoverRef"
            :pt="{ content: { class: 'p-0' } }"
            @show="onShow"
            @hide="isOpen = false"
        >
            <!-- Options list -->
            <div v-if="!manualMode" class="flex w-64 flex-col">
                <button
                    v-for="option in options"
                    :key="option.value"
                    type="button"
                    class="flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm text-surface-900 transition-colors hover:text-primary-800"
                    @click="onSelect(option.value)"
                >
                    {{ option.label }}
                    <Icon
                        v-if="
                            selectedPeriod === option.value &&
                            option.value !== 'custom'
                        "
                        name="tabler:check"
                        class="size-4 shrink-0 text-primary-600"
                    />
                </button>
            </div>

            <!-- Manual date + time -->
            <DatePicker
                v-else
                v-model="manualDate"
                :pt="{ panel: { class: 'border-none' } }"
                inline
                show-time
                hour-format="24"
                class="w-72"
                @date-select="onManualPick"
            />
        </Popover>
    </div>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover';
import type { HistoryPeriod } from '~/types/history';
import { useVehicleHistoryContext } from '~/composables/useVehicleHistory';

/**
 * History date filter: fixed periods (today/yesterday/…) plus a manual
 * date+time pick on an inline calendar — the «Оберіть дату» control.
 */

const { t } = useI18n();
const { selectedPeriod, customDate } = useVehicleHistoryContext();

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);
const isOpen = ref<boolean>(false);

/** Whether the popover shows the inline calendar instead of the options */
const manualMode = ref<boolean>(false);

/** Local calendar model; committed to the context on day pick */
const manualDate = ref<Date | null>(null);

const options = computed<{ label: string; value: HistoryPeriod }[]>(() => [
    {
        label: t('objects.vehicles.detail.history.period.today'),
        value: 'today'
    },
    {
        label: t('objects.vehicles.detail.history.period.yesterday'),
        value: 'yesterday'
    },
    {
        label: t('objects.vehicles.detail.history.period.dayBefore'),
        value: 'dayBefore'
    },
    {
        label: t('objects.vehicles.detail.history.period.last7days'),
        value: 'last7days'
    },
    {
        label: t('objects.vehicles.detail.history.period.custom'),
        value: 'custom'
    }
]);

/** Trigger label: option name, with the date appended where it helps */
const triggerLabel = computed<string>(() => {
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    switch (selectedPeriod.value) {
        case 'today':
            return `${t('objects.vehicles.detail.history.period.today')}, ${formatUaDate(new Date(now))}`;
        case 'yesterday':
            return `${t('objects.vehicles.detail.history.period.yesterday')}, ${formatUaDate(new Date(now - DAY))}`;
        case 'dayBefore':
            return `${t('objects.vehicles.detail.history.period.dayBefore')}, ${formatUaDate(new Date(now - 2 * DAY))}`;
        case 'last7days':
            return t('objects.vehicles.detail.history.period.last7days');
        default:
            return customDate.value ? formatUaDate(customDate.value) : '';
    }
});

const togglePopover = (event: MouseEvent): void => {
    popoverRef.value?.toggle(event);
};

/** Popover opens on the options list, seeded with the current custom date */
const onShow = (): void => {
    isOpen.value = true;
    manualMode.value = false;
    manualDate.value = customDate.value;
};

/** Fixed option applies immediately; «вручну» switches to the calendar */
const onSelect = (value: HistoryPeriod): void => {
    if (value === 'custom') {
        manualMode.value = true;
        return;
    }
    selectedPeriod.value = value;
    popoverRef.value?.hide();
};

/** Day pick commits the manual date and closes the popover */
const onManualPick = (): void => {
    if (!manualDate.value) return;
    customDate.value = manualDate.value;
    selectedPeriod.value = 'custom';
    popoverRef.value?.hide();
};
</script>
