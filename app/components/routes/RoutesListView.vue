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
                    :placeholder="$t('routes.list.searchPlaceholder')"
                    fluid
                />
            </IconField>

            <RoutesFiltersPopover />

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

            <template #cell-name="{ row }">
                <NuxtLink
                    :to="ROUTES.ROUTE_DETAIL(row.id)"
                    class="flex items-center gap-2.5 whitespace-nowrap"
                >
                    <span
                        class="size-2 shrink-0 rounded-full"
                        :class="statusDotClass(row.route)"
                    />
                    <span
                        class="font-medium text-sm text-surface-800 underline underline-offset-4"
                    >
                        {{ row.name }}
                    </span>
                </NuxtLink>
            </template>

            <template #cell-date="{ row }">
                <div class="flex flex-col gap-[0.125rem] leading-snug">
                    <span class="text-surface-800">
                        {{ row.dateLabel }}
                    </span>
                    <span class="text-surface-700">
                        {{ row.timeLabel }}
                    </span>
                </div>
            </template>

            <template #cell-routePath="{ row }">
                <span class="block max-w-120 md:truncate text-surface-900" :title="row.routePath">
                    {{ row.routePath }}
                </span>
            </template>

            <template #cell-distanceKm="{ row }">
                <div
                    class="flex lg:flex-col gap-2.5 lg:gap-1 leading-snug text-sm"
                >
                    <span class="font-medium text-surface-800">
                        {{
                            $t('routes.list.distance', {
                                n: row.distanceKm
                            })
                        }}
                    </span>
                    <span class="text-surface-700">
                        {{ row.durationLabel }}
                    </span>
                </div>
            </template>

            <template #cell-pointsCount="{ row, rowHovered }">
                <div>
                    <Chip
                        severity="primary"
                        class="text-xs font-medium transition"
                        :class="rowHovered ? 'bg-surface-300' : ''"
                        :label="String(row.pointsCount)"
                    />
                </div>
            </template>

            <template #cell-groups="{ row }">
                <div class="flex flex-wrap gap-1.5">
                    <UiColorChip
                        v-for="group in row.groups"
                        :key="group.id"
                        :label="group.name"
                        :color="group.color"
                    />
                </div>
            </template>

            <template #cell-resources="{ row }">
                <div class="flex flex-col gap-1 text-sm">
                    <span
                        v-if="row.vehicleLabel"
                        class="flex gap-1.5"
                    >
                        <Icon
                            name="tabler:truck"
                            class="size-4 shrink-0 text-surface-600 mt-0.5"
                        />
                        <span class="text-surface-900">
                            {{ row.vehicleLabel }}
                        </span>
                    </span>
                    <span
                        v-if="row.driverLabel"
                        class="flex gap-1.5"
                    >
                        <Icon
                            name="tabler:user"
                            class="size-4 shrink-0 text-surface-600 mt-0.5"
                        />
                        <span class="text-surface-800">
                            {{ row.driverLabel }}
                        </span>
                    </span>
                </div>
            </template>

            <template #cell-actions="{ row, rowHovered }">
                <div class="flex items-center gap-2">
                    <UiActionCommonButton :severity="rowHovered ? 'contrast': 'default'" @click="onEdit(row.route)">
                        <template #icon>
                            <Icon
                                name="tabler:pencil"
                                class="size-5 text-surface-800"
                            />
                        </template>
                        <template #label>
                            <span class="text-surface-900">
                                {{ $t('common.edit') }}
                            </span>
                        </template>
                    </UiActionCommonButton>
                    <UiActionCommonButton
                        severity="danger"
                        @click="onDelete(row.route)"
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

        <SharedClientTeleport :to="actionsTarget">
            <UiActionButton
                icon="tabler:plus"
                :label="$t('routes.list.add')"
                @click="onAdd"
            />
        </SharedClientTeleport>

        <SharedClientTeleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:route', to: ROUTES.ROUTES_PAGE },
                    { label: breadcrumbLabel }
                ]"
            />
        </SharedClientTeleport>

        <RoutesRouteEditDialog
            v-model:visible="editVisible"
            :route="editTarget"
        />

        <SharedConfirmDeleteDialog
            v-model:visible="deleteVisible"
            group="confirmDeleteRoute"
            :title="$t('routes.list.modal.deleteTitle')"
            :message="$t('routes.list.modal.deleteSubtitle')"
            :item-name="deleteTarget?.name"
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
import { ROUTES } from '~/constants/routes';
import { ROUTE_STATUS_META } from '~/constants/route-list';
import { COMPANY_BADGES } from '~/mocks/vehicles';
import {
    useRouteFilters,
    ROUTE_FILTERS_KEY
} from '~/composables/useRouteFilters';

/** One display row of the route table, flattened for sorting */
interface RouteListRow extends Record<string, unknown> {
    id: string;
    /** Source route behind the row */
    route: Route;
    /** First owning company (the sort field of «Компанія») */
    company: string;
    companyBadge: string;
    name: string;
    /** ISO start date-time (lexicographic sort works); '' when regular */
    date: string;
    dateLabel: string;
    timeLabel: string;
    /** "start → finish" summary of the «Маршрут» column */
    routePath: string;
    distanceKm: number;
    durationLabel: string;
    pointsCount: number;
    /** Resolved groups with their accent colors */
    groups: { id: string; name: string; color: GroupColor }[];
    vehicleLabel: string;
    driverLabel: string;
}

interface RoutesListViewProps {
    /** True renders the «Заплановані маршрути» list, false the regular one */
    scheduled: boolean;
}

const props = defineProps<RoutesListViewProps>();

const { t } = useI18n();
const toast = useToast();
const { routes, deleteRoute } = useRoutes();
const { groups } = useGroups();
const { drivers } = useDrivers();
const { vehicles } = useVehicles();

/** Shared filter state, provided to the filters popover */
const filters = useRouteFilters();
provide(ROUTE_FILTERS_KEY, filters);

const searchQuery = ref<string>('');
const editVisible = ref<boolean>(false);
const editTarget = ref<Route | null>(null);
const deleteVisible = ref<boolean>(false);
const deleteTarget = ref<Route | null>(null);

const actionsTarget = usePageActionsTarget();

/** Breadcrumb label of the current list */
const breadcrumbLabel = computed<string>(() =>
    t(
        props.scheduled
            ? 'routes.breadcrumbScheduled'
            : 'routes.breadcrumbRegular'
    )
);

const columns = computed<TableColumn[]>(() => [
    {
        field: 'company',
        header: t('routes.list.columns.company'),
        sortable: true
    },
    {
        field: 'name',
        header: t('routes.list.columns.name'),
        sortable: true
    },
    ...(props.scheduled
        ? [
              {
                  field: 'date',
                  header: t('routes.list.columns.date'),
                  sortable: true,
                  width: '120px'
              } satisfies TableColumn
          ]
        : []),
    {
        field: 'routePath',
        header: t('routes.list.columns.route'),
    },
    {
        field: 'distanceKm',
        header: t('routes.list.columns.params'),
        sortable: true,
        width: '150px'
    },
    {
        field: 'pointsCount',
        header: t('routes.list.columns.points'),
        sortable: true,
        width: '120px'
    },
    {
        field: 'groups',
        header: t('routes.list.columns.groups'),
        width: '350px'
    },
    {
        field: 'resources',
        header: t('routes.list.columns.resources'),
    },
    {
        field: 'actions',
        header: t('routes.list.columns.actions'),
        align: 'right',
        width: '100px'
    }
]);

/** Total travel time as a «X год» / «X год Y хв» label */
const durationLabel = (route: Route): string => {
    const minutes = routeDurationMinutes(route);
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    const parts: string[] = [];
    if (hours) parts.push(t('routes.list.durationHours', { n: hours }));
    if (rest || !hours)
        parts.push(t('routes.list.durationMinutes', { n: rest }));
    return parts.join(' ');
};

/** «Ресурси» vehicle line: the single vehicle label, or just a count */
const vehicleLabel = (route: Route): string => {
    if (route.vehicleIds.length === 0) return '';
    if (route.vehicleIds.length > 1) {
        return t('routes.list.vehiclesCount', route.vehicleIds.length);
    }
    const vehicle = vehicles.value.find((v) => v.id === route.vehicleIds[0]);
    return vehicle
        ? `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`
        : '';
};

/** «Ресурси» driver line: the single driver name, or just a count */
const driverLabel = (route: Route): string => {
    if (route.driverIds.length === 0) return '';
    if (route.driverIds.length > 1) {
        return t('routes.list.driversCount', route.driverIds.length);
    }
    return drivers.value.find((d) => d.id === route.driverIds[0])?.name ?? '';
};

/** Formats an ISO start date-time into the two «Дата» cell lines */
const dateLines = (startAt: string | null): [string, string] => {
    if (!startAt) return ['', ''];
    const date = new Date(startAt);
    return [
        formatUaDate(date),
        `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    ];
};

/** Routes of this list (regular or scheduled), before search/filters */
const scopedRoutes = computed<Route[]>(() =>
    routes.value.filter((route) => route.scheduled === props.scheduled)
);

/** Display rows after the search query and the popover filters */
const rows = computed<RouteListRow[]>(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return scopedRoutes.value
        .filter(filters.matches)
        .map((route): RouteListRow => {
            const company = route.companies[0] ?? '';
            const start = route.points[0]?.address ?? '';
            const finish = route.points[route.points.length - 1]?.address ?? '';
            const [dateLabel, timeLabel] = dateLines(route.startAt);
            return {
                id: route.id,
                route,
                company,
                companyBadge: COMPANY_BADGES[company] ?? '—',
                name: route.name,
                date: route.startAt ?? '',
                dateLabel,
                timeLabel,
                routePath: `${start} → ${finish}`,
                distanceKm: routeDistanceKm(route),
                durationLabel: durationLabel(route),
                pointsCount: route.points.length,
                groups: route.groupIds.flatMap((id) => {
                    const group = groups.value.find((g) => g.id === id);
                    return group
                        ? [{ id, name: group.name, color: group.color }]
                        : [];
                }),
                vehicleLabel: vehicleLabel(route),
                driverLabel: driverLabel(route)
            };
        })
        .filter(
            (row) =>
                !query ||
                row.name.toLowerCase().includes(query) ||
                row.routePath.toLowerCase().includes(query)
        );
});

/** Status dot class of the route name cell */
const statusDotClass = (route: Route): string =>
    ROUTE_STATUS_META[route.status].dotClass;

/** Resets search and popover filters back to default */
const onResetFilters = (): void => {
    searchQuery.value = '';
    filters.reset();
};

/** «Додати» navigates to the full route create form */
const onAdd = (): void => {
    void navigateTo(ROUTES.ROUTES_NEW);
};

/** Opens the edit dialog prefilled with the selected route */
const onEdit = (route: Route): void => {
    editTarget.value = route;
    editVisible.value = true;
};

/** Opens the delete confirmation dialog for the selected route */
const onDelete = (route: Route): void => {
    deleteTarget.value = route;
    deleteVisible.value = true;
};

/** Deletes the selected route once the deletion is confirmed */
const onConfirmDelete = (): void => {
    const target = deleteTarget.value;
    if (!target) return;
    deleteRoute(target.id);
    toast.add({
        severity: 'success',
        summary: t('routes.list.deleted'),
        detail: target.name,
        life: 2000
    });
};
</script>
