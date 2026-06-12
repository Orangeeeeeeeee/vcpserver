<template>
    <div>
        <UiFilterButton
            :label="$t('common.filter')"
            :expanded="isOpen"
            @click="toggle"
        />

        <Popover
            ref="popoverRef"
            @show="isOpen = true"
            @hide="isOpen = false"
        >
            <div class="flex w-80 flex-col gap-4">
                <!-- Quick status filters -->
                <div class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.online.filters.status') }}
                    </span>
                    <div class="flex flex-wrap gap-1.5">
                        <button
                            v-for="value in QUICK_FILTERS"
                            :key="value"
                            type="button"
                            class="cursor-pointer rounded px-2 py-1 text-sm transition-colors"
                            :class="
                                statusFilters.includes(value)
                                    ? 'bg-surface-300 text-surface-950'
                                    : 'bg-surface-200 text-surface-700 hover:text-surface-900'
                            "
                            @click="toggleStatusFilter(value)"
                        >
                            {{ $t(`objects.online.filters.quick.${value}`) }}
                        </button>
                    </div>
                </div>

                <!-- Mock checkbox section -->
                <div
                    class="flex flex-col gap-2 border-t border-surface-200 pt-3"
                >
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.online.filters.filterName') }}
                    </span>
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                        <label
                            v-for="n in 6"
                            :key="n"
                            class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                        >
                            <Checkbox
                                v-model="checkboxChoices"
                                :value="String(n)"
                                size="small"
                            />
                            {{ $t('objects.online.filters.option', { n }) }}
                        </label>
                    </div>
                </div>

                <!-- Mock radio section -->
                <div
                    class="flex flex-col gap-2 border-t border-surface-200 pt-3"
                >
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.online.filters.filterName') }}
                    </span>
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                        <label
                            v-for="n in 4"
                            :key="n"
                            class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                        >
                            <RadioButton
                                v-model="radioChoice"
                                :value="String(n)"
                                size="small"
                            />
                            {{ $t('objects.online.filters.option', { n }) }}
                        </label>
                    </div>
                </div>

                <!-- Mock toggle sections -->
                <div
                    class="flex items-center justify-between gap-2 border-t border-surface-200 pt-3"
                >
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.online.filters.filterName') }}
                    </span>
                    <ToggleSwitch v-model="toggleA" />
                </div>
                <div
                    class="flex items-center justify-between gap-2 border-t border-surface-200 pt-3"
                >
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.online.filters.filterName') }}
                    </span>
                    <ToggleSwitch v-model="toggleB" />
                </div>
            </div>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover';
import {
    useOnlineFleetContext,
    type OnlineQuickFilter
} from '~/composables/useOnlineFleet';

/** Quick filter chips in display order */
const QUICK_FILTERS: OnlineQuickFilter[] = [
    'all',
    'moving',
    'standing',
    'engineOff'
];

const {
    statusFilters,
    toggleStatusFilter,
    checkboxChoices,
    radioChoice,
    toggleA,
    toggleB
} = useOnlineFleetContext();

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

/** Whether the filter popover is currently open (drives the active button styles) */
const isOpen = ref<boolean>(false);

const toggle = (event: MouseEvent): void => {
    popoverRef.value?.toggle(event);
};
</script>
