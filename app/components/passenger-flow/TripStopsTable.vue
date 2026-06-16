<template>
    <div class="flex flex-col gap-4">
        <h2 class="text-lg text-surface-900">
            {{ $t('passengerFlow.trip.table.title') }}
        </h2>

        <SharedResponsiveTable
            :value="stops"
            :columns="columns"
            :footer-row="totalRow"
            row-key="id"
        >
            <template #cell-departureTime="{ row }">
                <div class="flex flex-col">
                    <span class="font-medium">{{ formatIsoDateToUa((row.departureTime as string).split(' ')[0] as string) }}</span>
                    <span class="text-surface-700">{{ (row.departureTime as string).split(' ')[1] }}</span>
                </div>
            </template>
            <template #cell-distance="{ row }">
                {{ $t('passengerFlow.trip.table.distanceValue', { value: row.distance }) }}
            </template>
            <template #cell-passengers="{ row }">
                <Chip
                    :label="String(row.passengers)"
                    severity="primary"
                    class="text-xs font-medium"
                />
            </template>
            <template #cell-amount="{ row }">
                <div class="flex flex-col gap-0.5">
                    <span v-for="(entry, index) in row.amountBreakdown as PassengerFlowAmountEntry[]" :key="index">
                        {{ formatAmountBreakdown(entry.count, entry.price, entry.total, entry.location) }}
                    </span>
                </div>
            </template>
            <template #cell-photo="{ row }">
                <img
                    :src="row.photo as string"
                    :alt="row.zone as string"
                    class="w-28 h-14 object-cover cursor-pointer"
                    @click="openPreview(row.photo as string, row.zone as string)"
                >
            </template>
            <template #footer-departureTime="{ value }">
                {{ value }}
            </template>
            <template #footer-distance="{ value }">
                {{ $t('passengerFlow.trip.table.distanceValue', { value }) }}
            </template>
            <template #footer-passengers>
                &nbsp;
            </template>
            <template #footer-amount="{ value }">
                {{ value }}
            </template>
            <template #footer-photo>
                &nbsp;
            </template>
        </SharedResponsiveTable>

        <Dialog
            v-model:visible="previewVisible"
            modal
            dismissable-mask
            :show-header="false"
            :pt="{
                root: { class: 'shadow-none bg-transparent border-none p-0' },
                content: { class: 'p-0 bg-transparent' },
                mask: { class: 'backdrop-blur-sm' }
            }"
            @click="previewVisible = false"
        >
            <div class="relative" @click.stop>
                <img
                    :src="previewSrc"
                    :alt="previewAlt"
                    class="max-h-[80vh] max-w-[90vw] rounded-2xl object-contain block"
                >
                <button
                    type="button"
                    class="absolute top-3 right-3 cursor-pointer flex items-center justify-center size-8 rounded-full bg-white shadow-md text-surface-700 hover:bg-surface-100 transition-colors"
                    @click="previewVisible = false"
                >
                    <Icon name="tabler:x" class="size-4" />
                </button>
            </div>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '~/components/shared/ResponsiveTable';
import type { PassengerFlowAmountEntry, PassengerFlowTripStop } from '~/types/passenger-flow';
import { formatAmountBreakdown } from '~/utils/string';

const { stops } = defineProps<{
    stops: PassengerFlowTripStop[];
}>();

const { t } = useI18n();

const previewVisible = ref<boolean>(false);
const previewSrc = ref<string>('');
const previewAlt = ref<string>('');

/** Open the image preview dialog */
const openPreview = (src: string, alt: string): void => {
    previewSrc.value = src;
    previewAlt.value = alt;
    previewVisible.value = true;
};

const columns = computed<TableColumn[]>(() => [
    {
        field: 'departureTime',
        header: t('passengerFlow.trip.table.columns.departureTime')
    },
    {
        field: 'zone',
        header: t('passengerFlow.trip.table.columns.zone')
    },
    {
        field: 'distance',
        header: t('passengerFlow.trip.table.columns.distance')
    },
    {
        field: 'passengers',
        header: t('passengerFlow.trip.table.columns.passengers')
    },
    {
        field: 'boarded',
        header: t('passengerFlow.trip.table.columns.boarded')
    },
    {
        field: 'alighted',
        header: t('passengerFlow.trip.table.columns.alighted')
    },
    {
        field: 'amount',
        header: t('passengerFlow.trip.table.columns.amount')
    },
    {
        field: 'photo',
        header: t('passengerFlow.trip.table.columns.photo')
    }
]);

/** Aggregated "Всього" row rendered as the table footer */
const totalRow = computed(() => {
    const totalDistance = stops.reduce((sum, stop) => sum + stop.distance, 0);
    const totalBoarded = stops.reduce((sum, stop) => sum + stop.boarded, 0);
    const totalAlighted = stops.reduce((sum, stop) => sum + stop.alighted, 0);
    const totalAmount = Math.round(stops.reduce((sum, stop) => sum + stop.amount, 0) * 10) / 10;

    return {
        id: t('passengerFlow.total'),
        departureTime: t('passengerFlow.total'),
        zone: '',
        distance: totalDistance,
        passengers: '',
        boarded: totalBoarded,
        alighted: totalAlighted,
        photo: '',
        amount: totalAmount
    };
});
</script>