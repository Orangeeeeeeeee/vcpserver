<template>
    <div>
        <SharedPageLayout :title="$t('passengerFlow.title')">
            <template #content>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-4 md:pt-5 md:pb-5 md:border-b border-surface-200">
                    <div class="flex gap-2">
                        <div class="flex items-center justify-center bg-surface-200 rounded-md size-12 shrink-0">
                            <Icon name="tabler:bus" class="size-6 text-surface-700" />
                        </div>

                        <div class="grid md:grid-cols-2 md:grid-rows-2 gap-1 md:items-center">
                            <div class="flex items-center gap-1 min-w-0 md:gap-4">
                                <UiTypography variant="h5">
                                    {{ transport.transport }} (ID: {{ transport.transportId }})
                                </UiTypography>
                            </div>
                            <ul class="flex gap-3 truncate text-sm text-surface-900 list-disc md:col-start-1 md:col-end-2 md:row-start-2">
                                <li class="list-none pl-3 relative before:absolute before:left-0 before:top-1/2 before:w-[6px] before:h-[6px] before:bg-surface-300 before:content-[''] before:-translate-y-1/2">{{ transport.group }}</li>
                                <li class="list-none pl-3 relative before:absolute before:left-0 before:top-1/2 before:w-[6px] before:h-[6px] before:bg-surface-300 before:content-[''] before:-translate-y-1/2">{{ transport.driver }}</li>
                            </ul>

                            <div>
                                <Tag class="text-primary-600 text-xs md:self-center">
                                    <Icon name="tabler:users" class="size-3 text-primary-300" />
                                    {{ $t('passengerFlow.label') }}
                                </Tag>
                            </div>
                        </div>
                    </div>

                    <PassengerFlowPeriodFilter />
                </div>

                <TotalInfo :cards="transportStats" />

                <MainCharts :charts="transportMainCharts" />

                <AdditionalCharts :charts="transportCharts" :openDefault="true" />

                <TripsTable :trips="trips" />
            </template>
        </SharedPageLayout>

        <SharedClientTeleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:chart-bar', to: ROUTES.PASSENGER_FLOW },
                    { label: `${transport.transport} (ID: ${transport.transportId})` }
                ]"
            />
        </SharedClientTeleport>
    </div>
</template>

<script setup lang="ts">
import type { PassengerFlowRecord } from '~/types/passenger-flow';
import { ROUTES } from '~/constants/routes';
import AdditionalCharts from '~/components/passenger-flow/AdditionalCharts.vue';
import MainCharts from '~/components/passenger-flow/MainCharts.vue';
import type { MainChartConfig } from '~/components/passenger-flow/MainCharts.vue';
import TotalInfo from '~/components/passenger-flow/TotalInfo.vue';
import TripsTable from '~/components/passenger-flow/TripsTable.vue';
import PassengerFlowPeriodFilter from '~/components/passenger-flow/PeriodFilter.vue';
import { primitiveColors } from '~/theme/colors';
import { generatePassengerFlowSeries } from '~/mocks/passenger-flow';
import { getPassengerFlowPeriodFactor } from '~/composables/usePassengerFlow';
import type { PassengerFlowDataPoint, PassengerFlowChartType } from '~/components/passenger-flow/PassengerFlowChart.vue';
import type { PassengerFlowTotal } from '~/components/passenger-flow/PassengerFlowTotalCard.vue';
import { computed } from 'vue';

const { t } = useI18n();
const route = useRoute();
const { records } = usePassengerFlow();

const transportId = computed<string>(() => route.params.id as string);

const transportRef = computed<PassengerFlowRecord | undefined>(() =>
    records.value.find((r) => r.transportId === transportId.value)
);

if (!transportRef.value) {
    throw createError({
        statusCode: 404,
        statusMessage: t('passengerFlow.transport.notFound'),
        fatal: true
    });
}

const transport = computed<PassengerFlowRecord>(() => transportRef.value as PassengerFlowRecord);

const { trips } = usePassengerFlowTrips(transportId.value);
const { selectedPeriod, customRange } = usePassengerFlowPeriodFilter();

/** Transport totals scaled to the selected time period */
const totals = computed(() => {
    const factor = getPassengerFlowPeriodFactor(selectedPeriod.value, customRange.value);

    return {
        trips: Math.round(transport.value.trips * factor),
        distance: Math.round(transport.value.distance * factor),
        passengers: Math.round(transport.value.passengers * factor),
        profit: Math.round(transport.value.profit * factor)
    };
});

interface ChartConfig {
    id: string;
    type: PassengerFlowChartType;
    color: string;
    title: string;
    /** Unit appended to the tooltip value (e.g. "км", "₴") */
    valueSuffix?: string;
    data: PassengerFlowDataPoint[];
}

const transportStats = computed<PassengerFlowTotal[]>(() => [
    {
        id: '1',
        color: primitiveColors.violet['500'],
        icon: 'tabler:route',
        title: t('passengerFlow.totalInfo.title1'),
        total: totals.value.trips,
        change: 32
    },
    {
        id: '2',
        color: primitiveColors.sky['500'],
        icon: 'tabler:road',
        title: t('passengerFlow.totalInfo.title2'),
        total: `${totals.value.distance} км`,
        change: -14
    },
    {
        id: '3',
        color: primitiveColors.amber['500'],
        icon: 'tabler:users',
        title: t('passengerFlow.totalInfo.title3'),
        total: totals.value.passengers,
        change: 32
    },
    {
        id: '4',
        color: primitiveColors.teal['500'],
        icon: 'tabler:wallet',
        title: t('passengerFlow.totalInfo.title4'),
        total: `${totals.value.profit} грн`,
        change: 32
    }
]);

const transportMainCharts = computed<MainChartConfig[]>(() => [
    {
        id: 'trips',
        type: 'column',
        color: primitiveColors.violet['500'],
        title: t('passengerFlow.mainCharts.title1'),
        total: totals.value.trips,
        data: generatePassengerFlowSeries(totals.value.trips, `${transportId.value}-${selectedPeriod.value}`)
    },
    {
        id: 'distance',
        type: 'area',
        color: primitiveColors.sky['500'],
        title: t('passengerFlow.mainCharts.title2'),
        total: `${totals.value.distance} км`,
        valueSuffix: 'км',
        data: generatePassengerFlowSeries(totals.value.distance, `${transportId.value}-${selectedPeriod.value}`)
    },
    {
        id: 'passengers',
        type: 'column',
        color: primitiveColors.amber['500'],
        title: t('passengerFlow.mainCharts.title3'),
        total: totals.value.passengers,
        data: generatePassengerFlowSeries(totals.value.passengers, `${transportId.value}-${selectedPeriod.value}`)
    },
    {
        id: 'revenue',
        type: 'area',
        color: primitiveColors.teal['500'],
        title: t('passengerFlow.mainCharts.title4'),
        total: `${totals.value.profit} грн`,
        valueSuffix: '₴',
        data: generatePassengerFlowSeries(totals.value.profit, `${transportId.value}-${selectedPeriod.value}`)
    }
]);

const transportCharts = computed<ChartConfig[]>(() => [
    {
        id: 'trips',
        type: 'area',
        color: primitiveColors.teal['500'],
        title: t('passengerFlow.additionalCharts.title1'),
        valueSuffix: 'км',
        data: generatePassengerFlowSeries(totals.value.trips, `${transportId.value}-1-${selectedPeriod.value}`)
    },
    {
        id: 'distance',
        type: 'area',
        color: primitiveColors.violet['500'],
        title: t('passengerFlow.additionalCharts.title2'),
        data: generatePassengerFlowSeries(totals.value.distance, `${transportId.value}-2-${selectedPeriod.value}`)
    },
    {
        id: 'passengers',
        type: 'area',
        color: primitiveColors.rose['500'],
        title: t('passengerFlow.additionalCharts.title3'),
        data: generatePassengerFlowSeries(totals.value.passengers, `${transportId.value}-3-${selectedPeriod.value}`)
    },
    {
        id: 'profit',
        type: 'area',
        color: primitiveColors.indigo['500'],
        title: t('passengerFlow.additionalCharts.title4'),
        valueSuffix: '₴',
        data: generatePassengerFlowSeries(totals.value.profit, `${transportId.value}-4-${selectedPeriod.value}`)
    },
    {
        id: 'passenger_revenue',
        type: 'area',
        color: primitiveColors.amber['500'],
        title: t('passengerFlow.additionalCharts.title5'),
        valueSuffix: '₴',
        data: generatePassengerFlowSeries(totals.value.profit, `${transportId.value}-5-${selectedPeriod.value}`)
    }
]);

</script>
