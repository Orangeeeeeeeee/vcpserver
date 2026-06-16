<template>
  <TotalInfo :cards="cardsData" />
</template>

<script setup lang="ts">
import TotalInfo from '~/components/passenger-flow/TotalInfo.vue';
import type { PassengerFlowTotal } from '~/components/passenger-flow/PassengerFlowTotalCard.vue';
import { primitiveColors } from '~/theme/colors';
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

const cardsData = computed<PassengerFlowTotal[]>(() => [
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
        total: `${totals.value.distance.toLocaleString('uk-UA')} км`,
        change: -14
    },
    {
        id: '3',
        color: primitiveColors.amber['500'],
        icon: 'tabler:users',
        title: t('passengerFlow.totalInfo.title3'),
        total: totals.value.passengers.toLocaleString('uk-UA'),
        change: 32
    },
    {
        id: '4',
        color: primitiveColors.teal['500'],
        icon: 'tabler:wallet',
        title: t('passengerFlow.totalInfo.title4'),
        total: `${totals.value.profit.toLocaleString('uk-UA')} ₴`,
        change: 32
    }
]);
</script>
