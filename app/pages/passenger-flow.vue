<template>
    <SharedPageLayout :title="$t('passengerFlow.title')">
        <template #content>
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
</script>
