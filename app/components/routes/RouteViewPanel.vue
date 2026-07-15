<template>
    <div class="h-full p-4 lg:p-0">
        <div
            class="flex h-full flex-col lg:rounded-[10px] lg:border lg:border-surface-300 lg:p-4"
        >
            <!-- Company + mobile/tablet map toggle -->
            <div
                class="mb-4 flex items-center justify-between gap-2 border-b border-surface-200 pb-4"
            >
                <div class="flex min-w-0 items-center gap-2">
                    <Avatar
                        :label="companyBadge"
                        shape="circle"
                        size="small"
                        class="size-[26px] shrink-0 text-[0.625rem] font-medium"
                    />
                    <span class="truncate font-semibold text-surface-950">
                        {{ companyName }}
                    </span>
                </div>
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
                <!-- Route summary -->
                <div
                    class="flex flex-col gap-2 border-b border-surface-200 pb-4"
                >
                    <div class="flex flex-wrap items-center gap-2">
                        <Icon
                            name="tabler:route"
                            class="size-5 shrink-0 text-surface-700"
                        />
                        <span class="font-semibold text-surface-950">
                            {{ viewedRoute.name }}
                        </span>
                        <Tag
                            :severity="statusSeverity"
                            :value="statusLabel"
                            class="ml-auto text-xs font-medium"
                        />
                    </div>
                    <div
                        class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-surface-800"
                    >
                        <span
                            v-if="dateLabel"
                            class="flex items-center gap-1 basis-full"
                        >
                            <Icon
                                name="tabler:calendar-event"
                                class="size-[1.125rem] shrink-0 text-surface-600"
                            />
                            {{ dateLabel }}
                        </span>
                        <span class="flex items-center gap-1">
                            <Icon
                                name="tabler:clock"
                                class="size-[1.125rem] shrink-0 text-surface-600"
                            />
                            {{ durationLabel }}
                        </span>
                        <span class="flex items-center gap-1">
                            <Icon
                                name="tabler:route"
                                class="size-[1.125rem] shrink-0 text-surface-600"
                            />
                            {{ distanceLabel }}
                        </span>
                    </div>
                </div>

                <!-- Groups -->
                <div
                    v-if="routeGroups.length"
                    class="flex flex-col gap-2.5 border-b border-surface-200 py-4"
                >
                    <span class="font-semibold text-surface-950">
                        {{ $t('routes.detail.groups') }}
                    </span>
                    <div class="flex flex-wrap gap-1.5">
                        <RoutesRoutePointChip
                            v-for="group in routeGroups"
                            :key="group.id"
                            :label="group.name"
                            :color="group.color"
                        />
                    </div>
                </div>

                <!-- Resources -->
                <div
                    v-if="resourcePairs.length"
                    class="border-b border-surface-200 py-4"
                >
                    <SharedAnimatedHeight class="flex flex-col">
                        <span class="mb-2.5 font-semibold text-surface-950">
                            {{ $t('routes.detail.resources') }}
                        </span>
                        <div
                            v-for="(pair, i) in visiblePairs"
                            :key="pair.id"
                            class="flex flex-col gap-1 py-2.5 text-sm text-surface-900"
                            :class="{
                                'border-b border-surface-200':
                                    i < visiblePairs.length - 1 || canToggle
                            }"
                        >
                            <span
                                v-if="pair.vehicleLabel"
                                class="flex items-center gap-1.5"
                            >
                                <Icon
                                    name="tabler:truck"
                                    class="size-4 shrink-0 text-surface-700"
                                />
                                {{ pair.vehicleLabel }}
                            </span>
                            <span
                                v-if="pair.driverLabel"
                                class="flex items-center gap-1.5"
                            >
                                <Icon
                                    name="tabler:user"
                                    class="size-4 shrink-0 text-surface-700"
                                />
                                {{ pair.driverLabel }}
                            </span>
                        </div>
                        <Button
                            v-if="canToggle"
                            text
                            severity="secondary"
                            class="mt-1 self-center text-sm font-medium text-surface-900"
                            @click="resourcesExpanded = !resourcesExpanded"
                        >
                            {{
                                $t(
                                    resourcesExpanded
                                        ? 'routes.detail.collapse'
                                        : 'routes.detail.expand'
                                )
                            }}
                            <template #icon>
                                <Icon
                                    :name="
                                        resourcesExpanded
                                            ? 'tabler:chevron-up'
                                            : 'tabler:chevron-down'
                                    "
                                    class="size-4"
                                />
                            </template>
                        </Button>
                    </SharedAnimatedHeight>
                </div>

                <!-- Points timeline -->
                <SharedEventFeed class="pt-4" :items="feedItems" />
            </UiScrollPanel>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RoutePoint } from '~/types/route';
import type { EventFeedItem } from '~/components/shared/EventFeed';
import {
    ROUTE_START_VIEW_META,
    ROUTE_FINISH_VIEW_META,
    ROUTE_POINT_TYPE_VIEW_META,
    ROUTE_MOVEMENT_VIEW_META,
    type RoutePointViewMeta
} from '~/constants/route-view';
import { ROUTE_STATUS_META } from '~/constants/route-list';
import { COMPANY_BADGES } from '~/mocks/vehicles';
import { useRouteViewContext } from '~/composables/useRouteView';

/**
 * Left panel of the route detail page: company, route summary with the
 * status badge, groups, assigned resources and the points timeline.
 */

const emit = defineEmits<{
    /** Below lg: close the panel overlay and show the map */
    showMap: [];
}>();

const { t } = useI18n();
const { route: viewedRoute } = useRouteViewContext();
const { groups } = useGroups();
const { drivers } = useDrivers();
const { vehicles } = useVehicles();

/** First owning company shown in the panel header */
const companyName = computed<string>(
    () => viewedRoute.value.companies[0] ?? ''
);

/** Avatar initials of the owning company */
const companyBadge = computed<string>(
    () => COMPANY_BADGES[companyName.value] ?? '—'
);

/** «Запланований» for scheduled routes, the lifecycle status otherwise */
const statusLabel = computed<string>(() =>
    viewedRoute.value.scheduled
        ? t('routes.create.general.scheduled')
        : t(ROUTE_STATUS_META[viewedRoute.value.status].labelKey)
);

/** Tag severity matching the status badge */
const statusSeverity = computed<string>(() => {
    if (viewedRoute.value.scheduled) return 'secondary';
    return viewedRoute.value.status === 'active' ? 'success' : 'danger';
});

/** Total travel time in minutes, summed from the point segments */
const totalMinutes = computed<number>(() =>
    routeDurationMinutes(viewedRoute.value)
);

/** «X год Y хв» total travel time */
const durationLabel = computed<string>(() => {
    const hours = Math.floor(totalMinutes.value / 60);
    const rest = totalMinutes.value % 60;
    const parts: string[] = [];
    if (hours) parts.push(t('routes.list.durationHours', { n: hours }));
    if (rest || !hours)
        parts.push(t('routes.list.durationMinutes', { n: rest }));
    return parts.join(' ');
});

/** «X км» total route distance */
const distanceLabel = computed<string>(() =>
    t('routes.list.distance', { n: routeDistanceKm(viewedRoute.value) })
);

/** «H:mm» time of a date */
const timeOf = (date: Date): string =>
    `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

/** «6 березня, 8:00-22:00» start date with the travel window; scheduled only */
const dateLabel = computed<string>(() => {
    const { scheduled, startAt } = viewedRoute.value;
    if (!scheduled || !startAt) return '';
    const start = new Date(startAt);
    const end = new Date(start.getTime() + totalMinutes.value * 60_000);
    const day = new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long'
    }).format(start);
    return `${day}, ${timeOf(start)}-${timeOf(end)}`;
});

/** Assigned groups resolved to their names and accent colors */
const routeGroups = computed(() =>
    viewedRoute.value.groupIds.flatMap((id) => {
        const group = groups.value.find((g) => g.id === id);
        return group ? [{ id, name: group.name, color: group.color }] : [];
    })
);

/** One «Ресурси» entry: a vehicle with the same-index driver */
interface ResourcePair {
    id: string;
    vehicleLabel?: string;
    driverLabel?: string;
}

/** Vehicles zipped with drivers by index; leftover drivers get own rows */
const resourcePairs = computed<ResourcePair[]>(() => {
    const { vehicleIds, driverIds } = viewedRoute.value;
    const count = Math.max(vehicleIds.length, driverIds.length);
    return Array.from({ length: count }, (_, i): ResourcePair => {
        const vehicle = vehicles.value.find((v) => v.id === vehicleIds[i]);
        const driver = drivers.value.find((d) => d.id === driverIds[i]);
        return {
            id: `${vehicleIds[i] ?? ''}-${driverIds[i] ?? ''}-${i}`,
            vehicleLabel: vehicle
                ? `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`
                : undefined,
            driverLabel: driver?.name
        };
    }).filter((pair) => pair.vehicleLabel || pair.driverLabel);
});

/** Whether the resources list is longer than its collapsed preview */
const canToggle = computed<boolean>(() => resourcePairs.value.length > 2);

const resourcesExpanded = ref<boolean>(false);

/** Resource entries currently shown (first 2 while collapsed) */
const visiblePairs = computed<ResourcePair[]>(() =>
    resourcesExpanded.value || !canToggle.value
        ? resourcePairs.value
        : resourcePairs.value.slice(0, 2)
);

/** View metadata of a point (start/finish by kind, otherwise by type) */
const pointMeta = (point: RoutePoint): RoutePointViewMeta => {
    if (point.kind === 'start') return ROUTE_START_VIEW_META;
    if (point.kind === 'finish') return ROUTE_FINISH_VIEW_META;
    return ROUTE_POINT_TYPE_VIEW_META[point.type ?? 'checkpoint'];
};

/** «2 г 45 хв» short label of a "HH:mm" segment duration */
const segmentDuration = (timeToPoint: string | null): string | undefined => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(timeToPoint ?? '');
    if (!match) return undefined;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const parts: string[] = [];
    if (hours) parts.push(t('routes.detail.hoursShort', { n: hours }));
    if (minutes || !hours)
        parts.push(t('routes.list.durationMinutes', { n: minutes }));
    return parts.join(' ');
};

/** Points interleaved with «Рух» movement segments for the feed */
const feedItems = computed<EventFeedItem[]>(() => {
    const items: EventFeedItem[] = [];
    const points = viewedRoute.value.points;
    points.forEach((point, i) => {
        const prev = points[i - 1];
        if (prev) {
            const km =
                prev.coords && point.coords
                    ? Math.round(haversineKm(prev.coords, point.coords))
                    : null;
            items.push({
                id: `${point.id}-move`,
                icon: ROUTE_MOVEMENT_VIEW_META.icon,
                iconClass: ROUTE_MOVEMENT_VIEW_META.textClass,
                title: t('routes.detail.movement'),
                duration: segmentDuration(point.timeToPoint),
                distance:
                    km !== null
                        ? t('routes.list.distance', { n: km })
                        : undefined
            });
        }
        const meta = pointMeta(point);
        items.push({
            id: point.id,
            icon: meta.icon,
            iconClass: meta.textClass,
            title: point.name || point.address,
            badge: { label: t(meta.labelKey), color: meta.badgeColor },
            duration: point.stopDurationMinutes
                ? t('routes.list.durationMinutes', {
                      n: point.stopDurationMinutes
                  })
                : undefined,
            address: point.address
        });
    });
    return items;
});
</script>
