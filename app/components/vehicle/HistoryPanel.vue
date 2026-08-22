<template>
    <div class="h-full p-4 lg:p-0">
        <div
            class="flex h-full flex-col lg:rounded-[10px] lg:border lg:border-surface-300 lg:p-4"
        >
            <!-- Date filter + mobile/tablet map toggle -->
            <div class="mb-5 flex items-center gap-2">
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
                <SharedEventFeed :items="feedItems" />

                <!-- Summary cards -->
                <div class="mt-6 grid grid-cols-2 gap-3">
                    <div class="rounded-md border border-surface-300 px-3 py-2">
                        <span
                            class="mb-2 block border-b border-surface-200 pb-1 font-medium text-surface-950"
                        >
                            {{
                                $t(
                                    'objects.vehicles.detail.history.summary.move'
                                )
                            }}
                        </span>
                        <div
                            class="flex flex-col gap-1 text-sm text-surface-800"
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

                    <div class="rounded-md border border-surface-300 px-3 py-2">
                        <span
                            class="mb-2 block border-b border-surface-200 pb-1 font-medium text-surface-950"
                        >
                            {{
                                $t(
                                    'objects.vehicles.detail.history.summary.stops'
                                )
                            }}
                        </span>
                        <div
                            class="flex flex-col gap-1 text-sm text-surface-800"
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
import type { EventFeedItem } from '~/components/shared/EventFeed';

/** Left panel of the history tab: date filter, events feed, summary cards */

const emit = defineEmits<{
    /** Below lg: close the panel overlay and show the map */
    showMap: [];
}>();

const { t } = useI18n();
const { history } = useVehicleHistoryContext();

/** History events mapped onto the shared feed rows */
const feedItems = computed<EventFeedItem[]>(() =>
    history.value.events.map((event) => {
        const meta = HISTORY_EVENT_META[event.type];
        return {
            id: event.id,
            icon: meta.icon,
            iconClass: meta.textClass,
            title: t(meta.labelKey),
            duration: event.duration,
            distance:
                event.distanceKm !== undefined
                    ? `${event.distanceKm} ${t('objects.vehicles.detail.stats.mileageUnit')}`
                    : undefined,
            address: event.address
        };
    })
);
</script>
