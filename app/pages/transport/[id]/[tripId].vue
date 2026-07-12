<template>
    <div>
        <SharedPageLayout :title="$t('passengerFlow.title')">
            <template #content>
                <div
                    class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 md:mb-4 md:p-5 md:border-b border-surface-200"
                >
                    <div class="flex flex-wrap items-center gap-2 min-w-0">
                        <div
                            class="flex items-center justify-center bg-surface-200 rounded-md size-12 shrink-0"
                        >
                            <Icon
                                name="tabler:bus"
                                class="size-6 text-surface-700"
                            />
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <div class="flex flex-col min-w-0 grow">
                                <div
                                    class="flex items-center gap-1 min-w-0 md:gap-4"
                                >
                                    <h4
                                        class="font-semibold text-surface-900 truncate text-[1.125rem] font-manrope"
                                    >
                                        {{ transport.transport }} (ID:
                                        {{ transport.transportId }})
                                    </h4>
                                </div>
                                <ul
                                    class="flex gap-3 truncate text-sm text-surface-900 list-disc marker:text-lg marker:text-surface-300"
                                >
                                    <li class="ml-4">{{ transport.group }}</li>
                                    <li class="ml-4">{{ transport.driver }}</li>
                                </ul>
                            </div>

                            <Tag class="text-primary-600 text-xs self-start">
                                <Icon
                                    name="tabler:users"
                                    class="size-3 text-primary-300"
                                />
                                {{ $t('passengerFlow.label') }}
                            </Tag>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <div
                            class="flex items-center justify-center bg-surface-200 rounded-md size-12"
                        >
                            <Icon
                                name="tabler:route"
                                class="size-6 text-surface-700"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <div
                                class="flex items-center gap-1.5 text-surface-900 font-medium text-[1.125rem]"
                            >
                                {{ trip.fromLocation }}
                                —
                                {{ trip.toLocation }}
                            </div>

                            <div class="flex gap-2">
                                <div
                                    class="flex items-center gap-1.5 text-surface-800"
                                >
                                    <Icon
                                        name="tabler:clock"
                                        class="size-5 text-surface-600"
                                    />
                                    {{ trip.duration }}
                                </div>

                                <div
                                    class="flex items-center gap-1.5 text-surface-800"
                                >
                                    <Icon
                                        name="tabler:route"
                                        class="size-5 text-surface-600"
                                    />
                                    {{ trip.distance }}
                                    {{ $t('passengerFlow.trip.distance') }}
                                </div>

                                <div
                                    class="flex items-center gap-1.5 text-surface-800"
                                >
                                    <Icon
                                        name="tabler:map-pin"
                                        class="size-5 text-surface-600"
                                    />
                                    {{ trip.pointsCount }} {{ pointsLabel }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <PassengerFlowTripStopsTable :stops="stops" />
            </template>
        </SharedPageLayout>

        <Teleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:chart-bar', to: ROUTES.PASSENGER_FLOW },
                    {
                        label: `${transport.transport} (ID: ${transport.transportId})`,
                        to: ROUTES.PASSENGER_FLOW_TRANSPORT_DETAIL(
                            transport.transportId
                        )
                    },
                    { label: trip.id }
                ]"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import type {
    PassengerFlowRecord,
    PassengerFlowTrip
} from '~/types/passenger-flow';
import { ROUTES } from '~/constants/routes';
import PassengerFlowTripStopsTable from '~/components/passenger-flow/TripStopsTable.vue';

const { t } = useI18n();
const route = useRoute();
const { records } = usePassengerFlow();

const transportId = computed<string>(() => route.params.id as string);
const tripId = computed<string>(() => route.params.tripId as string);

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

const transport = computed<PassengerFlowRecord>(
    () => transportRef.value as PassengerFlowRecord
);

const { trips } = usePassengerFlowTrips(transportId.value);

const tripRef = computed<PassengerFlowTrip | undefined>(() =>
    trips.value.find((tr) => tr.id === tripId.value)
);

if (!tripRef.value) {
    throw createError({
        statusCode: 404,
        statusMessage: t('passengerFlow.trip.notFound'),
        fatal: true
    });
}

const trip = computed<PassengerFlowTrip>(
    () => tripRef.value as PassengerFlowTrip
);

const { stops } = usePassengerFlowTripStops(
    trip.value.id,
    trip.value.pointsCount
);

/** Pluralized "точка/точки/точок" label for the trip's points count */
const pointsLabel = computed<string>(() =>
    pluralizeUa(
        trip.value.pointsCount,
        t('passengerFlow.trip.pointOne'),
        t('passengerFlow.trip.pointFew'),
        t('passengerFlow.trip.pointMany')
    )
);
</script>
