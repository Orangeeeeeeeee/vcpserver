<template>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <PassengerFlowTotalCard
            v-for="(card, index) in cardsData"
            :key="card.id"
            :data="card"
            :class="{ fourth: index === 3 }"
            :style="index === 3 ? { 
                borderColor: `color-mix(in srgb, ${card.color} 20%, transparent)`,
                background: `color-mix(in srgb, ${card.color} 10%, transparent)`
            } : null"
        />
    </div>
</template>

<script setup lang="ts">
import type { PassengerFlowTotal } from '~/components/passenger-flow/PassengerFlowTotalCard.vue';
import { primitiveColors } from '~/theme/colors';
const { t } = useI18n();

const cardsData: PassengerFlowTotal[] = [
    {
        id: '1',
        color: primitiveColors.violet['500'],
        icon: 'tabler:route',
        title: t('passengerFlow.totalInfo.title1'),
        total: 24,
        change: 32
    },
    {
        id: '2',
        color: primitiveColors.sky['500'],
        icon: 'tabler:road',
        title: t('passengerFlow.totalInfo.title2'),
        total: '23 456 км',
        change: -14
    },
    {
        id: '3',
        color: primitiveColors.amber['500'],
        icon: 'tabler:users',
        title: t('passengerFlow.totalInfo.title3'),
        total: '2 345',
        change: 32
    },
    {
        id: '4',
        color: primitiveColors.teal['500'],
        icon: 'tabler:wallet',
        title: t('passengerFlow.totalInfo.title4'),
        total: '2 567 $',
        change: 32
    }
];
</script>
