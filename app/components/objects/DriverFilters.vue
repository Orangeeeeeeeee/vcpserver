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
                        {{ $t('objects.drivers.filters.company') }}
                    </span>
                    <Select
                        v-model="state.company"
                        :options="companies"
                        show-clear
                        :placeholder="
                            $t('objects.drivers.filters.companyPlaceholder')
                        "
                        fluid
                    />
                </div>

                <!-- Status -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.drivers.filters.status') }}
                    </span>
                    <UiMultiSelect
                        v-model="state.statuses"
                        :options="statusOptions"
                        option-label="label"
                        option-value="value"
                        display="chip"
                        :placeholder="
                            $t('objects.drivers.filters.statusPlaceholder')
                        "
                        fluid
                        show-select-all
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </UiMultiSelect>
                </div>

                <!-- Employment type -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.drivers.filters.employment') }}
                    </span>
                    <UiMultiSelect
                        v-model="state.employment"
                        :options="employmentTypes"
                        display="chip"
                        :placeholder="
                            $t('objects.drivers.filters.employmentPlaceholder')
                        "
                        fluid
                        show-select-all
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </UiMultiSelect>
                </div>

                <!-- License categories -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.drivers.filters.categories') }}
                    </span>
                    <UiMultiSelect
                        v-model="state.categories"
                        :options="licenseCategoryOptions"
                        display="chip"
                        :placeholder="
                            $t('objects.drivers.filters.categoriesPlaceholder')
                        "
                        fluid
                        show-select-all
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </UiMultiSelect>
                </div>

                <!-- Vehicle — grouped, searchable, select-all -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.drivers.filters.vehicle') }}
                    </span>
                    <UiMultiSelect
                        v-model="state.vehicles"
                        :options="vehicleGroups"
                        option-group-label="label"
                        option-group-children="items"
                        option-label="label"
                        option-value="value"
                        filter
                        :filter-placeholder="
                            $t('objects.drivers.filters.search')
                        "
                        show-toggle-all
                        display="chip"
                        :placeholder="
                            $t('objects.drivers.filters.vehiclePlaceholder')
                        "
                        fluid
                    >
                        <template #optiongroup="{ option }">
                            <span class="flex items-center gap-2">
                                <div
                                    class="flex items-center justify-center size-4"
                                >
                                    <span
                                        class="size-1.5 shrink-0 rounded-full"
                                        :style="{
                                            backgroundColor: option.color
                                        }"
                                    />
                                </div>
                                <span>{{ option.label }}</span>
                            </span>
                        </template>
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </UiMultiSelect>
                </div>
            </div>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover';
import { useDriverFiltersContext } from '~/composables/useDriverFilters';

const {
    state,
    companies,
    statusOptions,
    employmentTypes,
    licenseCategoryOptions,
    vehicleGroups,
    activeCount
} = useDriverFiltersContext();

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

/** Whether the filter popover is currently open (drives the active button styles) */
const isOpen = ref<boolean>(false);

const toggle = (event: MouseEvent): void => {
    popoverRef.value?.toggle(event);
};
</script>
