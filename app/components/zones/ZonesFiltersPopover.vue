<template>
    <div>
        <UiFilterButton
            :label="$t('common.filter')"
            :expanded="isOpen"
            @click="toggle"
        />

        <Popover
            ref="popoverRef"
            :base-z-index="1100"
            @show="isOpen = true"
            @hide="isOpen = false"
        >
            <div class="flex w-80 flex-col gap-4">
                <!-- Company -->
                <div class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('zones.list.filters.company') }}
                    </span>
                    <UiMultiSelect
                        v-model="filters.companies"
                        :options="mockCompanies"
                        display="chip"
                        :placeholder="
                            $t('zones.list.filters.companyPlaceholder')
                        "
                        fluid
                        show-select-all
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click.stop="removeCallback"
                            />
                        </template>
                    </UiMultiSelect>
                </div>

                <!-- Zone shape -->
                <div class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('zones.list.filters.shape') }}
                    </span>
                    <UiMultiSelect
                        v-model="filters.shapes"
                        :options="ZONE_SHAPE_OPTIONS"
                        option-value="value"
                        :option-label="(o) => t(o.labelKey)"
                        display="chip"
                        :placeholder="$t('zones.list.filters.shapePlaceholder')"
                        fluid
                    >
                        <template #option="{ option }">
                            <span class="flex items-center gap-2">
                                <Icon
                                    :name="option.icon"
                                    class="size-4 text-surface-700"
                                />
                                {{ $t(option.labelKey) }}
                            </span>
                        </template>
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click.stop="removeCallback"
                            />
                        </template>
                    </UiMultiSelect>
                </div>

                <!-- Zone type -->
                <div class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('zones.list.filters.type') }}
                    </span>
                    <UiMultiSelect
                        v-model="filters.types"
                        :options="ZONE_TYPE_OPTIONS"
                        option-value="value"
                        :option-label="(o) => t(o.labelKey)"
                        display="chip"
                        :placeholder="$t('zones.list.filters.typePlaceholder')"
                        fluid
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click.stop="removeCallback"
                            />
                        </template>
                    </UiMultiSelect>
                </div>

                <!-- Vehicle groups -->
                <div class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('zones.list.filters.groups') }}
                    </span>
                    <UiMultiSelect
                        v-model="filters.groupIds"
                        :options="groupOptions"
                        option-label="label"
                        option-value="value"
                        display="chip"
                        :placeholder="
                            $t('zones.list.filters.groupsPlaceholder')
                        "
                        fluid
                        show-select-all
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click.stop="removeCallback"
                            />
                        </template>
                    </UiMultiSelect>
                </div>

                <!-- Vehicle -->
                <div class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('zones.list.filters.vehicle') }}
                    </span>
                    <UiMultiSelect
                        v-model="filters.vehicleIds"
                        :options="vehicleOptions"
                        option-label="label"
                        option-value="value"
                        display="chip"
                        :placeholder="
                            $t('zones.list.filters.vehiclePlaceholder')
                        "
                        fluid
                        show-select-all
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click.stop="removeCallback"
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
import { mockCompanies } from '~/mocks/companies';
import { ZONE_SHAPE_OPTIONS, ZONE_TYPE_OPTIONS } from '~/constants/zones';
import { useZonesOverviewContext } from '~/composables/useZonesOverview';

/** Option of the group / vehicle multiselects */
interface ZonesFilterOption {
    label: string;
    value: string;
}

const { t } = useI18n();
const { filters } = useZonesOverviewContext();
const { groups } = useGroups();
const { vehicles } = useVehicles();

/** Group multiselect options (label: group name, value: group id) */
const groupOptions = computed<ZonesFilterOption[]>(() =>
    groups.value.map((group) => ({ label: group.name, value: group.id }))
);

/** Vehicle multiselect options (label: brand + model + id) */
const vehicleOptions = computed<ZonesFilterOption[]>(() =>
    vehicles.value.map((vehicle) => ({
        label: `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`,
        value: vehicle.id
    }))
);

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

/** Whether the filter popover is currently open (drives the active button styles) */
const isOpen = ref<boolean>(false);

/**
 * Toggles the filter popover anchored to the filter button.
 * @param event Click event used as the popover anchor
 */
const toggle = (event: MouseEvent): void => {
    popoverRef.value?.toggle(event);
};
</script>
