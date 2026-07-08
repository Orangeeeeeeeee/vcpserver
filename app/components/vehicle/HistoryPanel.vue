<template>
    <div class="h-full p-4 lg:p-0">
        <div
            class="flex h-full flex-col lg:rounded-[10px] lg:border lg:border-surface-300 lg:p-4"
        >
            <!-- Date filter + mobile/tablet map toggle -->
            <div class="mb-4 flex items-center gap-2">
                <VehicleHistoryPeriodFilter />
                <div class="flex shrink-0 items-center gap-2 lg:hidden">
                    <UiMapAction
                        class="hidden md:inline-flex"
                        icon="tabler:x"
                        :aria-label="$t('objects.online.mapView')"
                        @click="emit('showMap')"
                    />
                    <UiMapAction
                        class="md:hidden"
                        icon="tabler:map"
                        :aria-label="$t('objects.online.mapView')"
                        @click="emit('showMap')"
                    />
                </div>
            </div>

            <UiScrollPanel class="min-h-0 flex-1">
                <!-- Events feed -->
                <div class="flex flex-col">
                    <div
                        v-for="(event, i) in history.events"
                        :key="event.id"
                        class="relative flex gap-3 pb-5"
                    >
                        <!-- connector line to the next event -->
                        <span
                            v-if="i < history.events.length - 1"
                            class="absolute left-[1.1875rem] top-10 bottom-0 w-px bg-surface-300"
                        />
                        <span
                            class="z-[1] flex size-9.5 shrink-0 items-center justify-center rounded-md border border-surface-300 bg-surface-0"
                        >
                            <Icon
                                :name="HISTORY_EVENT_META[event.type].icon"
                                :class="
                                    HISTORY_EVENT_META[event.type].textClass
                                "
                                class="size-5"
                            />
                        </span>
                        <div class="flex min-w-0 flex-col gap-1 pt-0.5">
                            <span class="font-medium text-surface-950">
                                {{
                                    $t(HISTORY_EVENT_META[event.type].labelKey)
                                }}
                            </span>
                            <div
                                class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-surface-800"
                            >
                                <span
                                    v-if="event.duration"
                                    class="flex items-center gap-1"
                                >
                                    <Icon
                                        name="tabler:clock"
                                        class="size-[1.125rem] shrink-0 text-surface-600"
                                    />
                                    {{ event.duration }}
                                </span>
                                <span
                                    v-if="event.distanceKm !== undefined"
                                    class="flex items-center gap-1"
                                >
                                    <Icon
                                        name="tabler:route"
                                        class="size-[1.125rem] shrink-0 text-surface-600"
                                    />
                                    {{ event.distanceKm }}
                                    {{
                                        $t(
                                            'objects.vehicles.detail.stats.mileageUnit'
                                        )
                                    }}
                                </span>
                                <span
                                    v-if="event.address"
                                    class="flex items-center gap-1"
                                >
                                    <Icon
                                        name="tabler:map-pin"
                                        class="size-[1.125rem] shrink-0 text-surface-600"
                                    />
                                    {{ event.address }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Summary cards -->
                <div class="mt-1 grid grid-cols-2 gap-3">
                    <div class="rounded-md border border-surface-300 p-3">
                        <span
                            class="mb-2 block border-b border-surface-200 pb-2 font-medium text-surface-950"
                        >
                            {{
                                $t(
                                    'objects.vehicles.detail.history.summary.move'
                                )
                            }}
                        </span>
                        <div
                            class="flex flex-col gap-1.5 text-sm text-surface-800"
                        >
                            <span class="flex items-center gap-1.5">
                                <Icon
                                    name="tabler:route"
                                    class="size-[1.125rem] shrink-0 text-surface-600"
                                />
                                {{ history.summary.moveDistanceKm }}
                                {{
                                    $t(
                                        'objects.vehicles.detail.stats.mileageUnit'
                                    )
                                }}
                            </span>
                            <span class="flex items-center gap-1.5">
                                <Icon
                                    name="tabler:clock"
                                    class="size-[1.125rem] shrink-0 text-surface-600"
                                />
                                {{ history.summary.moveDuration }}
                            </span>
                        </div>
                    </div>

                    <div class="rounded-md border border-surface-300 p-3">
                        <span
                            class="mb-2 block border-b border-surface-200 pb-2 font-medium text-surface-950"
                        >
                            {{
                                $t(
                                    'objects.vehicles.detail.history.summary.stops'
                                )
                            }}
                        </span>
                        <div
                            class="flex flex-col gap-1.5 text-sm text-surface-800"
                        >
                            <span class="flex items-center gap-1.5">
                                <Icon
                                    name="tabler:player-pause"
                                    class="size-[1.125rem] shrink-0 text-surface-600"
                                />
                                {{
                                    $t(
                                        'objects.vehicles.detail.history.summary.stopsCount',
                                        { n: history.summary.stopsCount }
                                    )
                                }}
                            </span>
                            <span class="flex items-center gap-1.5">
                                <Icon
                                    name="tabler:clock"
                                    class="size-[1.125rem] shrink-0 text-surface-600"
                                />
                                {{ history.summary.stopsDuration }}
                            </span>
                        </div>
                    </div>
                </div>
            </UiScrollPanel>
        </div>
    </div>
</template>

<script setup lang="ts">
import { HISTORY_EVENT_META } from '~/constants/history';
import { useVehicleHistoryContext } from '~/composables/useVehicleHistory';

/** Left panel of the history tab: date filter, events feed, summary cards */

const emit = defineEmits<{
    /** Below lg: close the panel overlay and show the map */
    showMap: [];
}>();

const { history } = useVehicleHistoryContext();
</script>
