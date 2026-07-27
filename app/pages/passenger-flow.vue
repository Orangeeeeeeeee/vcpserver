<template>
    <SharedPageLayout :title="$t('passengerFlow.title')">
        <template #content>
            <SharedClientTeleport to="#page-breadcrumbs-target">
                <div class="flex flex-wrap items-center gap-3">
                    <UiMultiSelect
                        v-model="multiSelectValue"
                        :options="GROUPS"
                        :placeholder="$t('objects.trackers.allCompanies')"
                        show-select-all
                        class="w-40 md:w-56 groups-multiselect"
                    >
                        <template #value="{ value }">
                            {{ displayLabel(value) }}
                        </template>
                    </UiMultiSelect>

                    <PassengerFlowPeriodFilter />
                </div>
            </SharedClientTeleport>
            <PassengerFlowTotalInfo />
            <PassengerFlowMainCharts />
            <PassengerFlowAdditionalCharts />
            <PassengerFlowTable />
        </template>
    </SharedPageLayout>
</template>

<script setup lang="ts">
import PassengerFlowTotalInfo from '~/pages/passenger-flow/total-info.vue';
import PassengerFlowMainCharts from '~/pages/passenger-flow/main-charts.vue';
import PassengerFlowAdditionalCharts from '~/pages/passenger-flow/additional-charts.vue';
import PassengerFlowTable from '~/pages/passenger-flow/table.vue';
import PassengerFlowPeriodFilter from '~/components/passenger-flow/PeriodFilter.vue';
import { GROUPS } from '~/mocks/passenger-flow';

const { t } = useI18n();
const { selectedGroups } = usePassengerFlowGroupFilter();

/** Label shown in the trigger when values are selected */
const displayLabel = (value: string[]): string =>
    value.length === 0 || value.length === GROUPS.length
        ? t('objects.trackers.allCompanies')
        : value.join(', ');

/**
 * Bridges the multiselect model to the shared group filter, where an empty
 * `selectedGroups` means "no filter" (all groups): the full selection
 * collapses to an empty filter, and an empty filter is displayed as the
 * full selection.
 */
const multiSelectValue = computed<string[]>({
    get() {
        return selectedGroups.value.length === 0
            ? [...GROUPS]
            : selectedGroups.value;
    },
    set(val: string[]) {
        selectedGroups.value = val.length === GROUPS.length ? [] : val;
    }
});
</script>
