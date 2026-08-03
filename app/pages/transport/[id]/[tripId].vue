<template>
    <div>
        <SharedPageLayout :title="$t('passengerFlow.title')">
            <template #content>
                <div
                    class="flex flex-col md:flex-row md:justify-between gap-3 mb-4 md:mb-4 md:pt-5 md:pb-5 md:border-b border-surface-200"
                >
                    <div class="flex flex-wrap gap-1.5 min-w-0">
                        <div
                            class="flex items-center justify-center bg-surface-200 rounded-md size-10 lg:size-12 shrink-0"
                        >
                            <Icon
                                name="tabler:bus"
                                class="size-5 lg:size-6 text-surface-700"
                            />
                        </div>

                        <div
                            class="flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-y-0 lg:gap-x-1 lg:items-center"
                        >
                            <div
                                class="flex items-center gap-1 min-w-0 md:gap-4"
                            >
                                <UiTypography
                                    variant="h5"
                                    class="-mb-0.5 lg:mb-0"
                                >
                                    {{ transport.transport }} (ID:
                                    {{ transport.transportId }})
                                </UiTypography>
                            </div>
                            <ul
                                class="flex gap-3 truncate text-sm text-surface-900 list-none lg:col-start-1 lg:col-end-2 lg:row-start-2 mb-1 lg:-mt-2"
                            >
                                <li
                                    class="list-none pl-3 relative before:absolute before:left-0 before:top-1/2 before:w-[6px] before:h-[6px] before:bg-surface-300 before:content-[''] before:-translate-y-1/2 before:rounded-full"
                                >
                                    {{ transport.group }}
                                </li>
                                <li
                                    class="list-none pl-3 relative before:absolute before:left-0 before:top-1/2 before:w-[6px] before:h-[6px] before:bg-surface-300 before:content-[''] before:-translate-y-1/2 before:rounded-full"
                                >
                                    {{ transport.driver }}
                                </li>
                            </ul>

                            <div>
                                <Tag class="text-primary-600 md:self-center">
                                    <Icon
                                        name="tabler:users"
                                        class="size-3 text-primary-300"
                                    />
                                    {{ $t('passengerFlow.label') }}
                                </Tag>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 lg:gap-3">
                        <div
                            class="flex items-center justify-center bg-surface-200 rounded-md size-10 lg:size-12 shrink-0"
                        >
                            <Icon
                                name="tabler:route"
                                class="size-5 lg:size-6 text-surface-700"
                            />
                        </div>

                        <div class="flex flex-col -mt-1 lg:mt-0">
                            <UiTypography variant="h5">
                                {{ trip.fromLocation }}
                                —
                                {{ trip.toLocation }}
                            </UiTypography>

                            <div class="flex gap-2 text-sm lg:text-base">
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

        <SharedClientTeleport to="#page-breadcrumbs-target">
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
        </SharedClientTeleport>
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
