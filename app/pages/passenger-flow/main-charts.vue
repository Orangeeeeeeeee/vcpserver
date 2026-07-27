<template>
    <MainCharts :charts="charts" />
</template>

<script setup lang="ts">
import MainCharts from '~/components/passenger-flow/MainCharts.vue';
import type { MainChartConfig } from '~/components/passenger-flow/MainCharts.vue';
import { primitiveColors } from '~/theme/colors';
import { generatePassengerFlowSeries } from '~/mocks/passenger-flow';
import { getPassengerFlowPeriodFactor } from '~/composables/usePassengerFlow';

const { t } = useI18n();
const { records } = usePassengerFlow();
const { selectedGroups } = usePassengerFlowGroupFilter();
const { selectedPeriod, customRange } = usePassengerFlowPeriodFilter();

/** Records filtered by the selected groups */
const filteredRecords = computed(() => {
    if (selectedGroups.value.length === 0) return records.value;
    return records.value.filter((item) => selectedGroups.value.includes(item.group));
});

/** Weekly sums scaled to the selected time period */
const totals = computed(() => {
    const factor = getPassengerFlowPeriodFactor(selectedPeriod.value, customRange.value);

    return {
        trips: Math.round(filteredRecords.value.reduce((sum, item) => sum + item.trips, 0) * factor),
        distance: Math.round(filteredRecords.value.reduce((sum, item) => sum + item.distance, 0) * factor),
        passengers: Math.round(filteredRecords.value.reduce((sum, item) => sum + item.passengers, 0) * factor),
        profit: Math.round(filteredRecords.value.reduce((sum, item) => sum + item.profit, 0) * factor)
    };
});

/** Seed used to vary chart series depending on the active group/period filters */
const seed = computed(() => `${selectedGroups.value.join('-') || 'all'}-${selectedPeriod.value}`);

const charts = computed<MainChartConfig[]>(() => [
    {
        id: 'routes',
        type: 'column',
        color: primitiveColors.violet['500'],
        title: t('passengerFlow.mainCharts.title1'),
        total: totals.value.trips,
        data: generatePassengerFlowSeries(totals.value.trips, `${seed.value}-routes`)
    },
    {
        id: 'distance',
        type: 'area',
        color: primitiveColors.sky['500'],
        title: t('passengerFlow.mainCharts.title2'),
        total: totals.value.distance,
        valueSuffix: 'км',
        data: generatePassengerFlowSeries(totals.value.distance, `${seed.value}-distance`)
    },
    {
        id: 'passengers',
        type: 'column',
        color: primitiveColors.amber['500'],
        title: t('passengerFlow.mainCharts.title3'),
        total: totals.value.passengers,
        data: generatePassengerFlowSeries(totals.value.passengers, `${seed.value}-passengers`)
    },
    {
        id: 'revenue',
        type: 'area',
        color: primitiveColors.teal['500'],
        title: t('passengerFlow.mainCharts.title4'),
        total: totals.value.profit,
        valueSuffix: '₴',
        data: generatePassengerFlowSeries(totals.value.profit, `${seed.value}-revenue`)
    }
]);
</script>
