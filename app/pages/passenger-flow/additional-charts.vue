<template>
    <AdditionalCharts :charts="charts" :openDefault="true" />
</template>

<script setup lang="ts">
import AdditionalCharts from '~/components/passenger-flow/AdditionalCharts.vue';
import { primitiveColors } from '~/theme/colors';
import { generatePassengerFlowSeries } from '~/mocks/passenger-flow';
import { getPassengerFlowPeriodFactor } from '~/composables/usePassengerFlow';
import type {
    PassengerFlowChartType,
    PassengerFlowDataPoint
} from '~/components/passenger-flow/PassengerFlowChart.vue';

interface ChartConfig {
    id: string;
    type: PassengerFlowChartType;
    color: string;
    title: string;
    data: PassengerFlowDataPoint[];
}

const { t } = useI18n();
const { records } = usePassengerFlow();
const { selectedGroups } = usePassengerFlowGroupFilter();
const { selectedPeriod, customRange } = usePassengerFlowPeriodFilter();

/** Records filtered by the selected groups */
const filteredRecords = computed(() => {
    if (selectedGroups.value.length === 0) return records.value;
    return records.value.filter((item) => selectedGroups.value.includes(item.group));
});

/** Per-trip averages scaled to the selected time period */
const totals = computed(() => {
    const factor = getPassengerFlowPeriodFactor(selectedPeriod.value, customRange.value);
    const count = filteredRecords.value.length || 1;
    const trips = filteredRecords.value.reduce((sum, item) => sum + item.trips, 0);
    const distance = filteredRecords.value.reduce((sum, item) => sum + item.distance, 0);
    const passengers = filteredRecords.value.reduce((sum, item) => sum + item.passengers, 0);
    const profit = filteredRecords.value.reduce((sum, item) => sum + item.profit, 0);

    return {
        avgDistance: Math.round((distance / count) * factor),
        avgTripsDuration: Math.round(((trips * 10) / count) * factor),
        avgPassengers: Math.round((passengers / count) * factor),
        avgProfit: Math.round((profit / count) * factor),
        avgPassengerRevenue: passengers > 0 ? Math.round((profit / passengers) * 10) / 10 : 0
    };
});

/** Seed used to vary chart series depending on the active group/period filters */
const seed = computed(() => `${selectedGroups.value.join('-') || 'all'}-${selectedPeriod.value}`);

const charts = computed<ChartConfig[]>(() => [
    {
        id: 'routes',
        type: 'area',
        color: primitiveColors.teal['500'],
        title: t('passengerFlow.additionalCharts.title1'),
        data: generatePassengerFlowSeries(totals.value.avgDistance, `${seed.value}-routes`)
    },
    {
        id: 'distance',
        type: 'area',
        color: primitiveColors.violet['500'],
        title: t('passengerFlow.additionalCharts.title2'),
        data: generatePassengerFlowSeries(totals.value.avgTripsDuration, `${seed.value}-distance`)
    },
    {
        id: 'average_passengers',
        type: 'area',
        color: primitiveColors.rose['500'],
        title: t('passengerFlow.additionalCharts.title3'),
        data: generatePassengerFlowSeries(totals.value.avgPassengers, `${seed.value}-average_passengers`)
    },
    {
        id: 'average_profit',
        type: 'area',
        color: primitiveColors.indigo['500'],
        title: t('passengerFlow.additionalCharts.title4'),
        data: generatePassengerFlowSeries(totals.value.avgProfit, `${seed.value}-average_profit`)
    },
    {
        id: 'average_passenger_revenue',
        type: 'area',
        color: primitiveColors.amber['500'],
        title: t('passengerFlow.additionalCharts.title5'),
        data: generatePassengerFlowSeries(totals.value.avgPassengerRevenue, `${seed.value}-average_passenger_revenue`)
    }
]);
</script>
