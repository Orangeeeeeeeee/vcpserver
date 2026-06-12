<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div
            v-for="chart in charts"
            :key="chart.id"
            class="p-4 pb-1 border border-surface-300 rounded-md"
        >
            <div class="flex justify-between items-basearea mb-4">
                <h2 v-if="chart.title" class="text-lg text-surface-900">
                    {{ chart.title }}
                </h2>
                <div v-if="chart.total" class="text-base text-surface-900 rounded-2xl py-1 px-3" :style="{ background: `color-mix(in srgb, ${chart.color} 20%, transparent)` }">
                    {{ chart.total }}
                </div>
            </div>
            <PassengerFlowChart
                :data="chart.data"
                :type="chart.type"
                :color="chart.color"
                :title="chart.title"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import PassengerFlowChart from '~/components/passenger-flow/PassengerFlowChart.vue';
import { primitiveColors } from '~/theme/colors';
import type {
    PassengerFlowChartType,
    PassengerFlowDataPoint
} from '~/components/passenger-flow/PassengerFlowChart.vue';

const { t } = useI18n();

interface ChartConfig {
    id: string;
    type: PassengerFlowChartType;
    color: string;
    title: string;
    total: number;
    data: PassengerFlowDataPoint[];
}

const charts: ChartConfig[] = [
    {
        id: 'routes',
        type: 'column',
        color: primitiveColors.violet['500'],
        title: t('passengerFlow.mainCharts.title1'),
        total: 312,
        data: [
            { date: '01.03', count: 8 },
            { date: '08.03', count: 18 },
            { date: '16.03', count: 40 },
            { date: '24.03', count: 28 },
            { date: '28.03', count: 19 },
            { date: '31.03', count: 12 },
            { date: '01.04', count: 14 },
        ]
    },
    {
        id: 'distance',
        type: 'area',
        color: primitiveColors.sky['500'],
        title: t('passengerFlow.mainCharts.title2'),
        total: 8945,
        data: [
            { date: '01.03', count: 0 },
            { date: '08.03', count: 800 },
            { date: '16.03', count: 200 },
            { date: '24.03', count: 600 },
            { date: '28.03', count: 900 },
            { date: '31.03', count: 400 },
            { date: '01.04', count: 50 },
        ]
    },
    {
        id: 'passengers',
        type: 'column',
        color: primitiveColors.amber['500'],
        title: t('passengerFlow.mainCharts.title3'),
        total: 5482,
        data: [
            { date: '01.03', count: 8 },
            { date: '08.03', count: 18 },
            { date: '16.03', count: 30 },
            { date: '16.03', count: 20 },
            { date: '16.03', count: 40 },
            { date: '24.03', count: 28 },
            { date: '28.03', count: 19 },
            { date: '31.03', count: 12 },
            { date: '01.04', count: 14 },
        ]
    },
    {
        id: 'revenue',
        type: 'area',
        color: primitiveColors.teal['500'],
        title: t('passengerFlow.mainCharts.title4'),
        total: 125840,
        data: [
            { date: '01.03', count: 850 },
            { date: '08.03', count: 800 },
            { date: '16.03', count: 600 },
            { date: '16.03', count: 859 },
            { date: '16.03', count: 900 },
            { date: '24.03', count: 829 },
            { date: '28.03', count: 700 },
            { date: '31.03', count: 890 },
            { date: '01.04', count: 870 },
        ]
    }
];
</script>