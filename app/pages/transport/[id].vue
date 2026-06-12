<template>
    <div>
        <SharedPageLayout :title="$t('passengerFlow.title')">
            <template #content>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 md:mb-0 md:p-5 md:border-b border-surface-200">
                    <div class="flex items-center gap-3 min-w-0 lg:gap-5">
                        <div class="flex items-center justify-center bg-surface-200 rounded-md size-12">
                            <Icon name="tabler:bus" class="size-6 text-surface-700" />
                        </div>

                        <div class="flex flex-col min-w-0 grow">
                            <div class="flex items-center gap-1 min-w-0 md:gap-4">
                                <h4 class="font-semibold text-surface-900 truncate text-lg md:text-xl font-manrope">
                                    {{ transport.transport }} (ID: {{ transport.transportId }})
                                </h4>
                            </div>
                            <ul class="flex gap-3 truncate text-sm text-surface-900 list-disc marker:text-lg marker:text-surface-300">
                                <li class="ml-4">{{ transport.group }}</li>
                                <li class="ml-4">{{ transport.driver }}</li>
                            </ul>
                        </div>
                    </div>

                    test
                </div>

                <!-- Stats -->
                <div class="md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-surface-50 p-4 rounded">
                        <div class="text-surface-700 text-sm">{{ $t('passengerFlow.transport.fields.trips') }}</div>
                        <div class="font-semibold text-surface-900 text-xl">{{ transport.trips }}</div>
                    </div>
                    <div class="bg-surface-50 p-4 rounded">
                        <div class="text-surface-700 text-sm">{{ $t('passengerFlow.transport.fields.distance') }}</div>
                        <div class="font-semibold text-surface-900 text-xl">{{ transport.distance }} km</div>
                    </div>
                    <div class="bg-surface-50 p-4 rounded">
                        <div class="text-surface-700 text-sm">{{ $t('passengerFlow.transport.fields.passengers') }}</div>
                        <div class="font-semibold text-surface-900 text-xl">{{ transport.passengers }}</div>
                    </div>
                    <div class="bg-surface-50 p-4 rounded">
                        <div class="text-surface-700 text-sm">{{ $t('passengerFlow.transport.fields.profit') }}</div>
                        <div class="font-semibold text-surface-900 text-xl">{{ transport.profit }} UAH</div>
                    </div>
                </div>
            </template>
        </SharedPageLayout>

        <Teleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:chart-bar', to: ROUTES.PASSENGER_FLOW },
                    { label: `${transport.transport} (ID: ${transport.transportId})` }
                ]"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import type { PassengerFlowRecord } from '~/types/passenger-flow';
import { ROUTES } from '~/constants/routes';

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

console.log(transport.value);

</script>
