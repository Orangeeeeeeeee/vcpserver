<template>
    <div class="flex flex-col gap-4">
        <!-- Filters bar -->
        <div class="flex flex-wrap items-center gap-3">
            <IconField class="flex-1 min-w-0 md:flex-none md:w-72">
                <InputIcon>
                    <Icon
                        name="tabler:search"
                        class="size-5 text-surface-700 mt-[-0.17rem]"
                    />
                </InputIcon>
                <InputText
                    v-model="searchQuery"
                    :placeholder="$t('routes.trips.list.searchPlaceholder')"
                    fluid
                />
            </IconField>

            <RoutesTripsFiltersPopover :archive="archive" />

            <div
                v-if="filters.activeChips.value.length"
                class="flex flex-wrap items-center gap-2 basis-full md:basis-auto md:ml-auto"
            >
                <Chip
                    v-for="chip in filters.activeChips.value"
                    :key="chip.key"
                    :label="chip.label"
                    removable
                    @remove="chip.remove()"
                >
                    <template #removeicon>
                        <Icon
                            name="tabler:x"
                            class="cursor-pointer"
                            @click="chip.remove()"
                        />
                    </template>
                </Chip>
            </div>
        </div>

        <!-- Table -->
        <SharedResponsiveTable
            v-if="rows.length > 0"
            :value="rows"
            :columns="columns"
            paginator
            :rows="6"
            row-key="id"
            hoverable
        >
            <template #cell-company="{ row }">
                <div class="flex items-center gap-1">
                    <Avatar
                        :label="row.companyBadge"
                        shape="circle"
                        size="small"
                        class="size-[26px] text-[0.625rem] font-medium shrink-0"
                    />
                    <span class="font-semibold text-sm text-surface-950">
                        {{ row.company }}
                    </span>
                </div>
            </template>

            <template #cell-routePath="{ row }">
                <NuxtLink
                    :to="ROUTES.ROUTE_DETAIL(row.route.id)"
                    class="text-sm inline-block max-w-11/12 truncate font-medium text-surface-900 underline underline-offset-4"
                >
                    {{ row.routePath }}
                </NuxtLink>
            </template>

            <template #cell-status="{ row }">
                <div>
                    <UiColorChip
                        :label="row.statusLabel"
                        :color="row.statusColor"
                    />
                </div>
            </template>

            <template #cell-groups="{ row }">
                <div class="flex flex-wrap items-center gap-1.5">
                    <UiColorChip
                        v-for="group in row.visibleGroups"
                        :key="group.id"
                        :label="group.name"
                        :color="group.color"
                    />
                    <UiColorChip
                        v-if="row.extraGroupsCount > 0"
                        :label="`+${row.extraGroupsCount}`"
                    />
                </div>
            </template>

            <template #cell-plannedDistanceKm="{ row }">
                <div class="flex flex-col gap-[0.125rem] leading-snug">
                    <span class="font-medium">
                        {{
                            $t('routes.list.distance', {
                                n: row.plannedDistanceKm
                            })
                        }}
                    </span>
                    <span class="text-surface-600">
                        {{ row.plannedDurationLabel }}
                    </span>
                </div>
            </template>

            <template #cell-startAt="{ row }">
                <div class="flex flex-col gap-[0.125rem] leading-snug">
                    <span class="text-surface-800 font-medium">
                        {{ row.startDateLabel }}
                    </span>
                    <span class="text-surface-700">
                        {{ row.startTimeLabel }}
                    </span>
                </div>
            </template>

            <template #cell-finishAt="{ row }">
                <div class="flex flex-col gap-[0.125rem] leading-snug">
                    <span class="text-surface-800 font-medium">
                        {{ row.finishDateLabel }}
                    </span>
                    <span class="text-surface-700">
                        {{ row.finishTimeLabel }}
                    </span>
                </div>
            </template>

            <template #cell-resources="{ row }">
                <div class="flex flex-col gap-1 text-surface-900 w-full">
                    <span
                        v-if="row.vehicleLabel"
                        class="flex items-center gap-1.5 max-w-11/12"
                    >
                        <Icon
                            name="tabler:truck"
                            class="size-4 shrink-0 text-surface-600"
                        />
                        <span class="truncate text-surface-900">
                            {{ row.vehicleLabel }}
                        </span>
                    </span>
                    <span
                        v-if="row.driverLabel"
                        class="flex items-center gap-1.5 max-w-11/12"
                    >
                        <Icon
                            name="tabler:user"
                            class="size-4 shrink-0 text-surface-600"
                        />
                        <span class="truncate text-surface-800">
                            {{ row.driverLabel }}
                        </span>
                    </span>
                </div>
            </template>

            <template #cell-actualDistanceKm="{ row }">
                <div
                    class="flex flex-col gap-[0.125rem] leading-snug"
                    :class="
                        row.distanceExceeded
                            ? 'text-red-700'
                            : 'text-surface-800'
                    "
                >
                    <span class="font-medium">
                        {{
                            $t('routes.list.distance', {
                                n: row.actualDistanceKm
                            })
                        }}
                    </span>
                    <span
                        :class="row.distanceExceeded ? '' : 'text-surface-700'"
                    >
                        {{
                            $t('routes.trips.list.ofDistance', {
                                n: row.plannedDistanceKm
                            })
                        }}
                    </span>
                </div>
            </template>

            <template #cell-time="{ row }">
                <div
                    class="flex flex-col gap-[0.125rem] leading-snug whitespace-nowrap"
                    :class="
                        row.timeExceeded ? 'text-red-600' : 'text-surface-800'
                    "
                >
                    <span class="font-medium">
                        {{ row.actualDurationLabel }}
                    </span>
                    <span :class="row.timeExceeded ? '' : 'text-surface-700'">
                        {{
                            $t('routes.trips.list.ofValue', {
                                value: row.plannedDurationShortLabel
                            })
                        }}
                    </span>
                </div>
            </template>

            <template #cell-trackMatchPercent="{ row }">
                <div>
                    <UiColorChip
                        :label="`${row.trackMatchPercent}%`"
                        :color="trackMatchColor(row.trackMatchPercent)"
                    />
                </div>
            </template>

            <template #cell-actions="{ row }">
                <div class="flex items-center gap-2">
                    <UiActionCommonButton
                        v-if="!archive"
                        @click="onOpen(row.trip)"
                        severity="contrast"
                    >
                        <template #icon>
                            <Icon
                                name="tabler:arrow-up-right"
                                class="size-5 text-surface-800"
                            />
                        </template>
                        <template #label>
                            <span class="text-surface-900">
                                {{ $t('routes.trips.list.open') }}
                            </span>
                        </template>
                    </UiActionCommonButton>
                    <UiActionCommonButton
                        severity="danger"
                        @click="onDelete(row.trip, row.route)"
                    >
                        <template #icon>
                            <Icon
                                name="tabler:trash"
                                class="size-5 text-red-500"
                            />
                        </template>
                        <template #label>
                            <span class="text-red-600">
                                {{ $t('common.delete') }}
                            </span>
                        </template>
                    </UiActionCommonButton>
                </div>
            </template>
        </SharedResponsiveTable>
        <SharedTableEmpty
            v-else
            :message="$t('common.emptyMessage')"
            :reset-label="$t('common.resetFilters')"
            @reset="onResetFilters"
        />

        <SharedClientTeleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:route', to: ROUTES.ROUTES_PAGE },
                    { label: breadcrumbLabel }
                ]"
            />
        </SharedClientTeleport>

        <RoutesTripsResourcesDialog
            v-model:visible="resourcesVisible"
            :trip="resourcesTarget"
        />

        <SharedConfirmDeleteDialog
            v-model:visible="deleteVisible"
            group="confirmDeleteTrip"
            :title="$t('routes.trips.list.modal.deleteTitle')"
            :message="$t('routes.trips.list.modal.deleteSubtitle')"
            :item-name="deleteTargetName"
            :warning="$t('common.deleteWarning')"
            @confirm="onConfirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { TableColumn } from '~/components/shared/ResponsiveTable';
import type { GroupColor } from '~/types/group';
import type { Route } from '~/types/route';
import type { Trip } from '~/types/trip';
import type { PrimitiveColorName } from '~/theme/colors';
import { ROUTES } from '~/constants/routes';
import { TRIP_STATUS_META, trackMatchColor } from '~/constants/trip-list';
import { COMPANY_BADGES } from '~/mocks/vehicles';
import { useTripFilters, TRIP_FILTERS_KEY } from '~/composables/useTripFilters';

/** One display row of the trip table, flattened for sorting */
interface TripListRow extends Record<string, unknown> {
    id: string;
    /** Source trip behind the row */
    trip: Trip;
    /** Route the trip runs on */
    route: Route;
    /** First owning company (the sort field of «Компанія») */
    company: string;
    companyBadge: string;
    /** "start → finish" summary of the «Маршрут» column */
    routePath: string;
    statusLabel: string;
    statusColor: PrimitiveColorName;
    /** First groups shown as chips; the rest collapse into «+N» */
    visibleGroups: { id: string; name: string; color: GroupColor }[];
    extraGroupsCount: number;
    plannedDistanceKm: number;
    plannedDurationLabel: string;
    /** ISO start date-time (lexicographic sort works) */
    startAt: string;
    startDateLabel: string;
    startTimeLabel: string;
    /** ISO finish date-time; '' while active */
    finishAt: string;
    finishDateLabel: string;
    finishTimeLabel: string;
    vehicleLabel: string;
    driverLabel: string;
    actualDistanceKm: number;
    distanceExceeded: boolean;
    actualDurationLabel: string;
    plannedDurationShortLabel: string;
    timeExceeded: boolean;
    trackMatchPercent: number;
}

interface TripsListViewProps {
    /** True renders the «Архівні рейси» list, false the active one */
    archive: boolean;
}

const props = defineProps<TripsListViewProps>();

const { t } = useI18n();
const toast = useToast();
const { trips, deleteTrip } = useTrips();
const { routes } = useRoutes();
const { groups } = useGroups();
const { drivers } = useDrivers();
const { vehicles } = useVehicles();

/** Shared filter state, provided to the filters popover */
const filters = useTripFilters();
provide(TRIP_FILTERS_KEY, filters);

const searchQuery = ref<string>('');
const resourcesVisible = ref<boolean>(false);
const resourcesTarget = ref<Trip | null>(null);
const deleteVisible = ref<boolean>(false);
const deleteTarget = ref<Trip | null>(null);
const deleteTargetName = ref<string>('');

/** Breadcrumb label of the current list */
const breadcrumbLabel = computed<string>(() =>
    t(
        props.archive
            ? 'routes.trips.breadcrumbArchive'
            : 'routes.trips.breadcrumbActive'
    )
);

const columns = computed<TableColumn[]>(() =>
    props.archive
        ? [
              {
                  field: 'company',
                  header: t('routes.trips.list.columns.company'),
                  sortable: true
              },
              {
                  field: 'routePath',
                  header: t('routes.trips.list.columns.route'),
                  sortable: true,
              },
              {
                  field: 'status',
                  header: t('routes.trips.list.columns.status'),
                  width: '110px'
              },
              {
                  field: 'groups',
                  header: t('routes.trips.list.columns.groups'),
                  width: '140px'

              },
              {
                  field: 'startAt',
                  header: t('routes.trips.list.columns.start'),
                  sortable: true,
                  width: '125px'
              },
              {
                  field: 'finishAt',
                  header: t('routes.trips.list.columns.finish'),
                  sortable: true,
                  width: '125px'
              },
              {
                  field: 'resources',
                  header: t('routes.trips.list.columns.resources'),
              },
              {
                  field: 'actualDistanceKm',
                  header: t('routes.trips.list.columns.distance'),
                  width: '100px'
              },
              {
                  field: 'time',
                  header: t('routes.trips.list.columns.time'),
                  width: '120px'
              },
              {
                  field: 'trackMatchPercent',
                  header: t('routes.trips.list.columns.trackMatch'),
                  width: '90px'
              },
              {
                  field: 'actions',
                  header: t('routes.trips.list.columns.actions'),
                  align: 'right',
                  width: '70px'
              }
          ]
        : [
              {
                  field: 'company',
                  header: t('routes.trips.list.columns.company'),
                  sortable: true
              },
              {
                  field: 'routePath',
                  header: t('routes.trips.list.columns.route'),
                  sortable: true
              },
              {
                  field: 'groups',
                  header: t('routes.trips.list.columns.groups'),
                  width: '140px'
              },
              {
                  field: 'plannedDistanceKm',
                  header: t('routes.trips.list.columns.params'),
                  sortable: true,
                  width: '120px'
              },
              {
                  field: 'resources',
                  header: t('routes.trips.list.columns.vehicles')
              },
              {
                  field: 'actions',
                  header: t('routes.trips.list.columns.actions'),
                  align: 'right',
                  width: '110px'
              }
          ]
);

/** Minutes as a long «X год Y хв» label (the active «Параметри» column) */
const longDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    const parts: string[] = [];
    if (hours) parts.push(t('routes.list.durationHours', { n: hours }));
    if (rest || !hours)
        parts.push(t('routes.list.durationMinutes', { n: rest }));
    return parts.join(' ');
};

/** Minutes as a short «X г Y хв» label (the archive «Час» column) */
const shortDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    const parts: string[] = [];
    if (hours) parts.push(t('routes.detail.hoursShort', { n: hours }));
    if (rest || !hours)
        parts.push(t('routes.list.durationMinutes', { n: rest }));
    return parts.join(' ');
};

/** «Транспорти»/«Ресурси» vehicle line: single vehicle label or a count */
const vehicleLabel = (trip: Trip): string => {
    if (trip.resources.length === 0) return '';
    if (trip.resources.length > 1) {
        return t('routes.list.vehiclesCount', trip.resources.length);
    }
    const vehicle = vehicles.value.find(
        (v) => v.id === trip.resources[0]?.vehicleId
    );
    return vehicle
        ? `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`
        : '';
};

/** Driver line of the resources cell; empty when several resources */
const driverLabel = (trip: Trip): string => {
    if (trip.resources.length !== 1) return '';
    return (
        drivers.value.find((d) => d.id === trip.resources[0]?.driverId)?.name ??
        ''
    );
};

/** Formats an ISO date-time into the two-line date/time cell labels */
const dateLines = (iso: string | null): [string, string] => {
    if (!iso) return ['', ''];
    const date = new Date(iso);
    return [
        formatUaDate(date),
        `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    ];
};

/** Trips of this list (active or archived), before search/filters */
const scopedTrips = computed<Trip[]>(() =>
    trips.value.filter((trip) =>
        props.archive ? trip.status !== 'active' : trip.status === 'active'
    )
);

/** Display rows after the search query and the popover filters */
const rows = computed<TripListRow[]>(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return scopedTrips.value
        .filter(filters.matches)
        .flatMap((trip): TripListRow[] => {
            const route = routes.value.find((r) => r.id === trip.routeId);
            if (!route) return [];
            const company = route.companies[0] ?? '';
            const start = route.points[0]?.address ?? '';
            const finish = route.points[route.points.length - 1]?.address ?? '';
            const [startDateLabel, startTimeLabel] = dateLines(trip.startAt);
            const [finishDateLabel, finishTimeLabel] = dateLines(trip.finishAt);
            const statusMeta = TRIP_STATUS_META[trip.status];
            const tripGroups = route.groupIds.flatMap((id) => {
                const group = groups.value.find((g) => g.id === id);
                return group
                    ? [{ id, name: group.name, color: group.color }]
                    : [];
            });
            return [
                {
                    id: trip.id,
                    trip,
                    route,
                    company,
                    companyBadge: COMPANY_BADGES[company] ?? '—',
                    routePath: `${start} → ${finish}`,
                    statusLabel: t(statusMeta.labelKey),
                    statusColor: statusMeta.badgeColor,
                    visibleGroups: tripGroups.slice(0, 2),
                    extraGroupsCount: Math.max(tripGroups.length - 2, 0),
                    plannedDistanceKm: trip.plannedDistanceKm,
                    plannedDurationLabel: longDuration(trip.plannedMinutes),
                    startAt: trip.startAt,
                    startDateLabel,
                    startTimeLabel,
                    finishAt: trip.finishAt ?? '',
                    finishDateLabel,
                    finishTimeLabel,
                    vehicleLabel: vehicleLabel(trip),
                    driverLabel: driverLabel(trip),
                    actualDistanceKm: trip.actualDistanceKm,
                    distanceExceeded:
                        trip.actualDistanceKm > trip.plannedDistanceKm,
                    actualDurationLabel: shortDuration(trip.actualMinutes),
                    plannedDurationShortLabel: shortDuration(
                        trip.plannedMinutes
                    ),
                    timeExceeded: trip.actualMinutes > trip.plannedMinutes,
                    trackMatchPercent: trip.trackMatchPercent
                }
            ];
        })
        .filter(
            (row) =>
                !query ||
                row.route.name.toLowerCase().includes(query) ||
                row.routePath.toLowerCase().includes(query)
        );
});

/** Resets search and popover filters back to default */
const onResetFilters = (): void => {
    searchQuery.value = '';
    filters.reset();
};

/** Opens the resources dialog for the selected trip */
const onOpen = (trip: Trip): void => {
    resourcesTarget.value = trip;
    resourcesVisible.value = true;
};

/** Opens the delete confirmation dialog for the selected trip */
const onDelete = (trip: Trip, route: Route): void => {
    deleteTarget.value = trip;
    deleteTargetName.value = route.name;
    deleteVisible.value = true;
};

/** Deletes the selected trip once the deletion is confirmed */
const onConfirmDelete = (): void => {
    const target = deleteTarget.value;
    if (!target) return;
    deleteTrip(target.id);
    toast.add({
        severity: 'success',
        summary: t('routes.trips.deleted'),
        detail: deleteTargetName.value,
        life: 2000
    });
};
</script>
