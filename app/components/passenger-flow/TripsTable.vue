<template>
    <div class="flex flex-col gap-4">
        <h2 class="text-lg text-surface-900">
            {{ $t('passengerFlow.transport.tripsTable.title') }}
        </h2>

        <SharedResponsiveTable
            v-if="trips.length > 0"
            :value="trips"
            :columns="columns"
            :footer-row="totalRow"
            paginator
            hoverable
            :rows="9"
            row-key="id"
        >
            <template #cell-id="{ row }">
                <span class="inline-flex items-center gap-1.5 hover:underline" @click="onRowClick(row)">
                    {{ row.fromLocation }}
                    <Icon name="tabler:arrow-right" class="size-4" />
                    {{ row.toLocation }}
                </span>
            </template>
            <template #cell-departureAt="{ row }">
                <div class="flex lg:flex-col gap-2 lg:gap-0">
                    <span class="font-medium">{{ formatIsoDateToUa((row.departureAt as string).split(' ')[0] as string) }}</span>
                    <span class="text-surface-700">{{ (row.departureAt as string).split(' ')[1] }}</span>
                </div>
            </template>
            <template #cell-arrivalAt="{ row }">
                <div class="flex lg:flex-col gap-2 lg:gap-0">
                    <span class="font-medium">{{ formatIsoDateToUa((row.arrivalAt as string).split(' ')[0] as string) }}</span>
                    <span class="text-surface-700">{{ (row.arrivalAt as string).split(' ')[1] }}</span>
                </div>
            </template>
            <template #cell-distance="{ row }">
                <span class="font-medium">
                    {{ $t('passengerFlow.transport.tripsTable.distanceValue', { value: row.distance }) }}
                </span>
            </template>
            <template #cell-profit="{ row }">
                <span class="font-medium">
                    {{ $t('passengerFlow.transport.tripsTable.profitValue', { value: row.profit }) }}
                </span>
            </template>
            <template #footer-id="{ value }">
                <span class="text-surface-900">
                    {{ value }}
                </span>
            </template>
            <template #footer-departureAt>
                &nbsp;
            </template>
            <template #footer-arrivalAt>
                &nbsp;
            </template>
            <template #footer-passengers="{ value }">
                <span class="text-surface-800">
                    {{ value }}
                </span>
            </template>
            <template #footer-distance="{ value }">
                <span class="text-surface-900 font-medium">
                    {{ $t('passengerFlow.transport.tripsTable.distanceValue', { value }) }}
                </span>
            </template>
            <template #footer-profit="{ value }">
                <span class="text-surface-800">
                    {{ value }}
                </span>
            </template>
        </SharedResponsiveTable>
        <SharedTableEmpty
            v-else
            :message="$t('passengerFlow.table.emptyMessage')"
            :reset-label="$t('passengerFlow.table.resetFilters')"
        />
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '~/components/shared/ResponsiveTable';
import type { PassengerFlowTrip } from '~/types/passenger-flow';
import { ROUTES } from '~/constants/routes';

const { t } = useI18n();

const { trips } = defineProps<{
    trips: PassengerFlowTrip[];
}>();


const columns = computed<TableColumn[]>(() => [
    {
        field: 'id',
        header: t('passengerFlow.transport.tripsTable.columns.trip'),
        sortable: true
    },
    {
        field: 'departureAt',
        header: t('passengerFlow.transport.tripsTable.columns.departureAt'),
        sortable: true
    },
    {
        field: 'arrivalAt',
        header: t('passengerFlow.transport.tripsTable.columns.arrivalAt'),
        sortable: true
    },
    {
        field: 'distance',
        header: t('passengerFlow.transport.tripsTable.columns.distance'),
        sortable: true
    },
    {
        field: 'passengers',
        header: t('passengerFlow.transport.tripsTable.columns.passengers'),
        sortable: true
    },
    {
        field: 'profit',
        header: t('passengerFlow.transport.tripsTable.columns.profit'),
        sortable: true
    }
]);

/** Aggregated "Всього" row rendered as the table footer */
const totalRow = computed(() => {
    const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
    const totalPassengers = trips.reduce((sum, trip) => sum + trip.passengers, 0);
    const totalProfit = Math.round(trips.reduce((sum, trip) => sum + trip.profit, 0) * 10) / 10;

    return {
        id: t('passengerFlow.total'),
        departureAt: '',
        arrivalAt: '',
        distance: totalDistance,
        passengers: totalPassengers,
        profit: totalProfit
    };
});

/**
 * Navigate to trip detail page on row click
 */
const onRowClick = (row: PassengerFlowTrip): void => {
    navigateTo(ROUTES.PASSENGER_FLOW_TRIP_DETAIL(row.transportId, row.id));
};
</script>
