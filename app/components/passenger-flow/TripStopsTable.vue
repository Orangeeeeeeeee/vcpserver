<template>
    <div class="flex flex-col gap-4">
        <h2 class="text-lg text-surface-900">
            {{ $t('passengerFlow.trip.table.title') }}
        </h2>

        <SharedResponsiveTable
            :value="stops"
            :columns="columns"
            :footer-row="totalRow"
            hoverable
            row-key="id"
        >
            <template #cell-departureTime="{ row }">
                <div class="flex lg:flex-col gap-2 lg:gap-0">
                    <span class="font-medium">
                        {{
                            formatIsoDateToUa(
                                (row.departureTime as string).split(
                                    ' '
                                )[0] as string
                            )
                        }}
                    </span>
                    <span class="text-surface-700">
                        {{ (row.departureTime as string).split(' ')[1] }}
                    </span>
                </div>
            </template>
            <template #cell-distance="{ row }">
                {{
                    $t('passengerFlow.trip.table.distanceValue', {
                        value: row.distance
                    })
                }}
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
                    <span
                        v-for="(
                            entry, index
                        ) in row.amountBreakdown as PassengerFlowAmountEntry[]"
                        :key="index"
                    >
                        {{
                            formatAmountBreakdown(
                                entry.count,
                                entry.price,
                                entry.total,
                                entry.location
                            )
                        }}
                    </span>
                </div>
            </template>
            <template #cell-photo="{ row }">
                <button
                    type="button"
                    class="group relative block h-14 w-28 cursor-pointer overflow-hidden"
                    :aria-label="row.zone as string"
                    @click="
                        openPreview(
                            row.videoUrl as string,
                            row.photo as string,
                            row.zone as string
                        )
                    "
                >
                    <img
                        :src="row.photo as string"
                        :alt="row.zone as string"
                        class="h-full w-full object-cover"
                    />
                </button>
            </template>
            <template #footer-departureTime="{ value }">
                {{ value }}
            </template>
            <template #footer-distance="{ value }">
                {{ $t('passengerFlow.trip.table.distanceValue', { value }) }}
            </template>
            <template #footer-passengers>&nbsp;</template>
            <template #footer-amount="{ value }">
                {{ value }}
            </template>
            <template #footer-photo>&nbsp;</template>
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
                <div
                    class="w-[min(90vw,60rem)] aspect-video overflow-hidden rounded-2xl bg-surface-950"
                >
                    <UiVideoPlayer
                        :src="previewVideo"
                        :poster="previewPoster"
                        :title="previewAlt"
                        load="eager"
                        autoplay
                    />
                </div>
                <button
                    type="button"
                    class="absolute -top-10 right-0 cursor-pointer flex items-center justify-center size-8 rounded-full bg-white shadow-md text-surface-700 hover:bg-surface-100 transition-colors"
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
import type {
    PassengerFlowAmountEntry,
    PassengerFlowTripStop
} from '~/types/passenger-flow';
import { formatAmountBreakdown } from '~/utils/string';

const { stops } = defineProps<{
    stops: PassengerFlowTripStop[];
}>();

const { t } = useI18n();

const previewVisible = ref<boolean>(false);
const previewVideo = ref<string>('');
const previewPoster = ref<string>('');
const previewAlt = ref<string>('');

/** Open the stop video dialog (player mounts on open, unmounts on close) */
const openPreview = (video: string, poster: string, alt: string): void => {
    previewVideo.value = video;
    previewPoster.value = poster;
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
    const totalAmount =
        Math.round(stops.reduce((sum, stop) => sum + stop.amount, 0) * 10) / 10;

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
