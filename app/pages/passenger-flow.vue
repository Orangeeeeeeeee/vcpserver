<template>
    <SharedPageLayout :title="$t('passengerFlow.title')">
        <template #content>
            <Teleport to="#page-breadcrumbs-target">
                <div class="flex flex-wrap items-center gap-3">
                    <MultiSelect
                        v-model="multiSelectValue"
                        :options="allOptions"
                        :option-label="getOptionLabel"
                        :placeholder="$t('objects.trackers.allCompanies')"
                        class="w-40 md:w-56 groups-multiselect"
                        :pt="{ label: { class: 'p-placeholder' }, header: { style: 'display:none' } }"
                    >
                        <template #value="{ value }">
                            {{ displayLabel(value) }}
                        </template>
                    </MultiSelect>

                    <PassengerFlowPeriodFilter />
                </div>
            </Teleport>
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

const ALL = '__all__';

const allOptions = [ALL, ...GROUPS];

/** Returns display label for a given option value */
const getOptionLabel = (opt: string): string =>
    opt === ALL ? t('objects.trackers.allCompanies') : opt;

/** Label shown in the trigger when values are selected */
const displayLabel = (value: string[]): string => {
    const real = value.filter((v) => v !== ALL);
    return real.length === 0 || real.length === GROUPS.length
        ? t('objects.trackers.allCompanies')
        : real.join(', ');
};

const multiSelectValue = computed<string[]>({
    get() {
        return selectedGroups.value.length === 0 ? [ALL, ...GROUPS] : selectedGroups.value;
    },
    set(val: string[]) {
        const prevAllChecked = selectedGroups.value.length === 0;
        const newHasAll = val.includes(ALL);

        if (!prevAllChecked && newHasAll) {
            selectedGroups.value = [];
        } else if (prevAllChecked && !newHasAll) {
            selectedGroups.value = val.filter((v) => v !== ALL);
        } else {
            const groups = val.filter((v) => v !== ALL);
            selectedGroups.value = groups.length === GROUPS.length ? [] : groups;
        }
    }
});
</script>

