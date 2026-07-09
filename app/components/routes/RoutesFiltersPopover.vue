<template>
    <div>
        <UiFilterButton
            :label="$t('common.filter')"
            :badge="activeCount"
            :expanded="isOpen"
            @click="toggle"
        />

        <Popover ref="popoverRef" @show="isOpen = true" @hide="isOpen = false">
            <div class="flex w-80 flex-col gap-4">
                <!-- Company -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('routes.list.filters.company') }}
                    </span>
                    <Select
                        v-model="state.company"
                        :options="companies"
                        show-clear
                        :placeholder="
                            $t('routes.list.filters.companyPlaceholder')
                        "
                        fluid
                    />
                </div>

                <!-- Status -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('routes.list.filters.status') }}
                    </span>
                    <MultiSelect
                        v-model="state.statuses"
                        :options="statusOptions"
                        option-label="label"
                        option-value="value"
                        display="chip"
                        :placeholder="
                            $t('routes.list.filters.statusPlaceholder')
                        "
                        fluid
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </MultiSelect>
                </div>

                <!-- Group -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('routes.list.filters.group') }}
                    </span>
                    <MultiSelect
                        v-model="state.groupIds"
                        :options="groupOptions"
                        option-label="label"
                        option-value="value"
                        display="chip"
                        filter
                        :filter-placeholder="$t('common.search')"
                        :placeholder="
                            $t('routes.list.filters.groupPlaceholder')
                        "
                        fluid
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </MultiSelect>
                </div>

                <!-- Driver -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('routes.list.filters.driver') }}
                    </span>
                    <MultiSelect
                        v-model="state.driverIds"
                        :options="driverOptions"
                        option-label="label"
                        option-value="value"
                        display="chip"
                        filter
                        :filter-placeholder="$t('common.search')"
                        :placeholder="
                            $t('routes.list.filters.driverPlaceholder')
                        "
                        fluid
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </MultiSelect>
                </div>

                <!-- Vehicle -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('routes.list.filters.vehicle') }}
                    </span>
                    <MultiSelect
                        v-model="state.vehicleIds"
                        :options="vehicleOptions"
                        option-label="label"
                        option-value="value"
                        display="chip"
                        filter
                        :filter-placeholder="$t('common.search')"
                        :placeholder="
                            $t('routes.list.filters.vehiclePlaceholder')
                        "
                        fluid
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </MultiSelect>
                </div>
            </div>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover';
import { useRouteFiltersContext } from '~/composables/useRouteFilters';

const {
    state,
    companies,
    statusOptions,
    groupOptions,
    driverOptions,
    vehicleOptions,
    activeCount
} = useRouteFiltersContext();

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

/** Whether the filter popover is currently open (drives the active button styles) */
const isOpen = ref<boolean>(false);

const toggle = (event: MouseEvent): void => {
    popoverRef.value?.toggle(event);
};
</script>
