<template>
    <div class="p-4 mb-4 border border-surface-300 rounded-md">
        <button
            type="button"
            class="flex items-center justify-between w-full cursor-pointer"
            :aria-expanded="open"
            @click="open = !open"
        >
            <h2 class="text-lg text-surface-900">
                {{ $t('passengerFlow.additionalCharts.caption') }}
            </h2>
            <Icon :name="open ? 'tabler:chevron-up' : 'tabler:chevron-down'" class="size-5 text-surface-700" />
        </button>

        <div v-show="open" class="grid grid-cols-6 gap-4 mt-4">
            <div
                v-for="(chart, index) in charts"
                :key="chart.id"
                :class="[
                    'p-4 pb-1 border border-surface-300 rounded-md',
                    index === 0 || index === 1 ? 'col-span-6 md:col-span-3 xl:col-span-3' : 'col-span-6 md:col-span-3 xl:col-span-2',
                    index === 4 ? 'col-span-6 md:col-span-6 xl:col-span-2' : 'col-span-6 md:col-span-3 xl:col-span-2'
                ]"
            >
                <div class="flex justify-between items-basearea mb-4">
                    <h2 v-if="chart.title" class="text-lg text-surface-900">
                        {{ chart.title }}
                    </h2>
                </div>
                <PassengerFlowChart
                    :data="chart.data"
                    :type="chart.type"
                    :color="chart.color"
                    :title="chart.title"
                />
            </div>
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


interface ChartConfig {
    id: string;
    type: PassengerFlowChartType;
    color: string;
    title: string;
    data: PassengerFlowDataPoint[];
}

const { t } = useI18n();

import { ref } from 'vue';

const open = ref<boolean>(true);

const charts: ChartConfig[] = [
    {
        id: 'routes',
        type: 'area',
        color: primitiveColors.teal['500'],
        title: t('passengerFlow.additionalCharts.title1'),
        data: [
            { date: '01.03', count: 8 },
            { date: '08.03', count: 18 },
            { date: '16.03', count: 40 },
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
        color: primitiveColors.violet['500'],
        title: t('passengerFlow.additionalCharts.title2'),
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
        id: 'average_passengers',
        type: 'area',
        color: primitiveColors.rose['500'],
        title: t('passengerFlow.additionalCharts.title3'),
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
        id: 'average_profit',
        type: 'area',
        color: primitiveColors.indigo['500'],
        title: t('passengerFlow.additionalCharts.title4'),
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
    },
    {
        id: 'average_passenger_revenue',
        type: 'area',
        color: primitiveColors.amber['500'],
        title: t('passengerFlow.additionalCharts.title5'),
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
