<template>
    <div>
        <UiFilterButton
            :label="$t('common.filter')"
            :badge="activeCount"
            :expanded="isOpen"
            @click="toggle"
        />

        <Popover
            ref="popoverRef"
            @show="isOpen = true"
            @hide="isOpen = false"
        >
            <div class="flex w-80 flex-col gap-4">
                <!-- Company -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.vehicles.filters.company') }}
                    </span>
                    <UiMultiSelect
                        v-model="state.companies"
                        :options="companies"
                        display="chip"
                        :placeholder="
                            $t('objects.vehicles.filters.companyPlaceholder')
                        "
                        fluid
                        show-select-all
                    />
                </div>

                <!-- Type -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.vehicles.filters.type') }}
                    </span>
                    <UiMultiSelect
                        v-model="state.types"
                        :options="typeOptions"
                        option-label="label"
                        option-value="value"
                        display="chip"
                        :placeholder="
                            $t('objects.vehicles.filters.typePlaceholder')
                        "
                        fluid
                        show-select-all
                    />
                </div>
            </div>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover';
import { useVehicleFiltersContext } from '~/composables/useVehicleFilters';

const { state, companies, typeOptions, activeCount } =
    useVehicleFiltersContext();

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

/** Whether the filter popover is currently open (drives the active button styles) */
const isOpen = ref<boolean>(false);

const toggle = (event: MouseEvent): void => {
    popoverRef.value?.toggle(event);
};
</script>
