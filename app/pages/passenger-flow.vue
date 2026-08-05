<template>
    <SharedPageLayout :title="$t('passengerFlow.title')">
        <template #content>
            <SharedClientTeleport to="#page-breadcrumbs-target">
                <div class="flex flex-wrap items-center gap-3">
                    <UiMultiSelect
                        v-model="selectedGroups"
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

/**
 * Label shown in the trigger. Both an empty selection (no filter) and the
 * full selection filter to every group, so both read as "all companies".
 */
const displayLabel = (value: string[] | null | undefined): string =>
    !value?.length || value.length === GROUPS.length
        ? t('objects.trackers.allCompanies')
        : value.join(', ');
</script>
