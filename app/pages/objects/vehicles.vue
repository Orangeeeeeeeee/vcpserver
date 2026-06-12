<template>
    <div class="flex flex-col gap-4">
        <!-- Filter bar -->
        <div class="flex flex-wrap items-center gap-3">
            <IconField class="flex-1 min-w-0 md:flex-none md:w-72">
                <InputIcon>
                    <Icon
                        name="tabler:search"
                        class="size-5 text-surface-700"
                    />
                </InputIcon>
                <InputText
                    v-model="searchQuery"
                    :placeholder="$t('objects.vehicles.searchPlaceholder')"
                    fluid
                />
            </IconField>
            <ObjectsVehicleFilters />

            <div
                v-if="filters.state.companies.length"
                class="flex flex-wrap items-center gap-2 basis-full md:basis-auto md:ml-auto"
            >
                <Chip
                    v-for="company in filters.state.companies"
                    :key="company"
                    :label="company"
                    removable
                    @remove="removeCompany(company)"
                >
                    <template #removeicon>
                        <Icon
                            name="tabler:x"
                            class="cursor-pointer"
                            @click="removeCompany(company)"
                        />
                    </template>
                </Chip>
            </div>
        </div>

        <!-- Table OR empty banner -->
        <SharedResponsiveTable
            v-if="filteredRows.length > 0"
            :value="filteredRows"
            :columns="columns"
            paginator
            :rows="9"
            row-key="id"
        >
            <template #header-vehicle>
                <span class="hidden md:inline">
                    {{ $t('objects.vehicles.columns.vehicle') }}
                </span>
                <span class="md:hidden">
                    {{ $t('objects.vehicles.columns.vehicleShort') }}
                </span>
            </template>
            <template #cell-vehicle="{ row }">
                <div class="flex items-center gap-1">
                    <Icon
                        :name="VEHICLE_MOTION_META[row.motionStatus].icon"
                        :class="VEHICLE_MOTION_META[row.motionStatus].class"
                        class="size-5 shrink-0"
                    />
                    <div class="flex flex-col gap-[0.125rem] leading-none">
                        <span
                            class="font-semibold uppercase text-sm text-surface-950"
                        >
                            {{ row.vehicle }}
                        </span>
                        <span class="text-surface-700 uppercase text-sm">
                            ID: {{ row.name }}
                        </span>
                    </div>
                </div>
            </template>
            <template #cell-company="{ row }">
                <div class="flex items-center gap-1.5">
                    <Avatar
                        :label="row.companyBadge"
                        shape="circle"
                        size="small"
                        class="size-[26px] text-[0.625rem] font-medium"
                    />
                    <span class="font-semibold text-sm text-surface-950">
                        {{ row.company }}
                    </span>
                </div>
            </template>
            <template #cell-type="{ row }">
                <span
                    v-tooltip.top="typeTooltipOf(row)"
                    class="inline-flex items-center gap-2"
                >
                    <Icon
                        :name="VEHICLE_TYPE_ICONS[row.type]"
                        :class="conditionClassOf(row)"
                        class="size-5"
                    />
                    <span class="text-sm text-surface-700 md:hidden">
                        {{ typeLabelOf(row) }}
                    </span>
                </span>
            </template>
            <template #cell-driver="{ row }">
                <div class="flex items-center gap-1.5">
                    <Avatar
                        :label="row.driverInitials"
                        shape="circle"
                        size="small"
                        class="size-[26px] text-[0.625rem] font-medium"
                    />
                    <span class="text-sm truncate max-w-36 text-surface-900">
                        {{ row.driver }}
                    </span>
                </div>
            </template>
            <template #cell-carrier="{ row }">
                <Icon
                    :name="row.carrier ? 'tabler:check' : 'tabler:x'"
                    :class="row.carrier ? 'text-green-500' : 'text-red-500'"
                    class="size-5"
                />
            </template>
            <template #cell-address="{ row }">
                <span class="text-surface-800 text-sm">{{ row.address }}</span>
            </template>
            <template #cell-updatedAgo="{ row }">
                <span
                    class="inline-flex items-center gap-1.5 rounded bg-surface-200 px-2 py-1 text-sm text-surface-800"
                >
                    <Icon name="tabler:refresh" class="size-4 shrink-0" />
                    {{ row.updatedAgo }}
                </span>
            </template>
            <template #cell-actions="{ row }">
                <div class="flex items-center gap-2 justify-end">
                    <button
                        type="button"
                        class="cursor-pointer p-1 text-surface-800 transition-colors hover:text-surface-950"
                        :aria-label="$t('common.edit')"
                        @click="onEdit(row)"
                    >
                        <Icon name="tabler:pencil" class="size-5" />
                    </button>
                    <button
                        type="button"
                        class="cursor-pointer p-1 text-red-500 transition-colors hover:text-red-600"
                        :aria-label="$t('common.delete')"
                        @click="onDelete(row)"
                    >
                        <Icon name="tabler:trash" class="size-5" />
                    </button>
                </div>
            </template>
        </SharedResponsiveTable>
        <SharedTableEmpty
            v-else
            :message="$t('common.emptyMessage')"
            :reset-label="$t('common.resetFilters')"
            @reset="onResetFilters"
        />

        <ObjectsVehicleFormDialog
            v-model:visible="formVisible"
            :vehicle="formTarget"
        />

        <SharedConfirmDeleteDialog
            v-model:visible="deleteVisible"
            :title="$t('objects.vehicles.modal.deleteTitle')"
            :message="$t('objects.vehicles.modal.deleteSubtitle')"
            :item-name="
                deleteTarget
                    ? `${deleteTarget.brand} ${deleteTarget.model}`
                    : undefined
            "
            :warning="$t('common.deleteWarning')"
            @confirm="onConfirmDelete"
        />

        <!-- Teleports -->
        <Teleport :to="actionsTarget">
            <UiActionButton
                icon="tabler:plus"
                :label="$t('objects.add')"
                @click="onAdd"
            />
        </Teleport>

        <Teleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:bus', to: ROUTES.OBJECTS_ONLINE },
                    { label: $t('objects.tabs.vehicles') }
                ]"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { TableColumn } from '~/components/shared/ResponsiveTable';
import type { Vehicle } from '~/types/vehicle';
import {
    VEHICLE_CONDITION_CLASSES,
    VEHICLE_MOTION_META,
    VEHICLE_TYPE_ICONS
} from '~/constants/vehicles';
import { COMPANY_BADGES } from '~/mocks/vehicles';
import { ROUTES } from '~/constants/routes';
import {
    useVehicleFilters,
    VEHICLE_FILTERS_KEY
} from '~/composables/useVehicleFilters';

/** Table row view-model: vehicle + display fields the columns sort by */
interface VehicleRow extends Vehicle {
    /** Display name, e.g. "MAN TGX 18.480" */
    vehicle: string;
    /** Resolved driver name (or "—") */
    driver: string;
    driverInitials: string;
    companyBadge: string;
}

const { t } = useI18n();
const toast = useToast();
const { vehicles, conditions, deleteVehicle } = useVehicles();
const { drivers } = useDrivers();

/** Shared filter state/options, provided to the VehicleFilters popover */
const filters = useVehicleFilters();
provide(VEHICLE_FILTERS_KEY, filters);

const searchQuery = ref('');
const formVisible = ref<boolean>(false);
const formTarget = ref<Vehicle | null>(null);
const deleteVisible = ref<boolean>(false);
const deleteTarget = ref<Vehicle | null>(null);

const isTablet = useMediaQuery('(min-width: 768px)');
/** PageLayout slot to teleport the add button into — mobile sits next to title, desktop next to tabs */
const actionsTarget = computed((): string =>
    isTablet.value ? '#page-actions-target' : '#page-actions-header'
);

/** Driver lookup for resolving the table's driver column */
const driverById = computed(() => new Map(drivers.value.map((d) => [d.id, d])));

/** Rows enriched with display fields (needed for column sorting) */
const rows = computed<VehicleRow[]>(() =>
    vehicles.value.map((v) => {
        const driver = v.driverId
            ? driverById.value.get(v.driverId)
            : undefined;
        return {
            ...v,
            vehicle: `${v.brand} ${v.model}`,
            driver: driver?.name ?? '—',
            driverInitials: driver?.initials ?? '—',
            companyBadge:
                COMPANY_BADGES[v.company] ?? v.company.slice(0, 2).toUpperCase()
        };
    })
);

/** Rows filtered by name/ID substring + the filter-popover predicate */
const filteredRows = computed<VehicleRow[]>(() => {
    const q = searchQuery.value.trim().toLowerCase();
    return rows.value.filter((row) => {
        const matchesQuery =
            !q ||
            row.vehicle.toLowerCase().includes(q) ||
            row.name.toLowerCase().includes(q);
        return matchesQuery && filters.matches(row);
    });
});

const columns = computed<TableColumn[]>(() => [
    {
        field: 'vehicle',
        // the thead label is overridden by the responsive #header-vehicle
        // slot; this string feeds the mobile stacked-row data-label
        header: t('objects.vehicles.columns.vehicleShort'),
        sortable: true
    },
    {
        field: 'company',
        header: t('objects.vehicles.columns.company'),
        sortable: true
    },
    {
        field: 'type',
        header: t('objects.vehicles.columns.type'),
        sortable: true
    },
    {
        field: 'driver',
        header: t('objects.vehicles.columns.driver'),
        sortable: true
    },
    {
        field: 'carrier',
        header: t('objects.vehicles.columns.carrier'),
        sortable: true
    },
    {
        field: 'address',
        header: t('objects.vehicles.columns.address'),
        sortable: true
    },
    {
        field: 'updatedAgo',
        header: t('objects.vehicles.columns.updated'),
        sortable: true
    },
    {
        field: 'actions',
        header: t('objects.vehicles.columns.actions'),
        align: 'right'
    }
]);

/** Type-icon color derived from the vehicle condition (grey when unset) */
const conditionClassOf = (row: VehicleRow): string =>
    row.condition
        ? VEHICLE_CONDITION_CLASSES[row.condition]
        : 'text-surface-500';

/** Localized type label for the given row */
const typeLabelOf = (row: VehicleRow): string =>
    t(`objects.vehicles.types.${row.type}`);

/** Tooltip for the type column: type label + optional condition */
const typeTooltipOf = (row: VehicleRow): string => {
    const typeLabel = typeLabelOf(row);
    if (!row.condition) return typeLabel;
    const conditionLabel = t(
        conditions.find((c) => c.value === row.condition)?.labelKey ?? ''
    );
    return `${typeLabel} (${conditionLabel.toLocaleLowerCase('uk-UA')})`;
};

/** Removes a company from the filter (bound to the bar chips) */
const removeCompany = (company: string): void => {
    filters.state.companies = filters.state.companies.filter(
        (c) => c !== company
    );
};

/** Resets the search query and all popover filters */
const onResetFilters = (): void => {
    searchQuery.value = '';
    filters.reset();
};

/** Opens the form dialog in add mode (empty fields) */
const onAdd = (): void => {
    formTarget.value = null;
    formVisible.value = true;
};

/** Opens the form dialog in edit mode (pre-filled from the vehicle) */
const onEdit = (row: Vehicle): void => {
    formTarget.value = row;
    formVisible.value = true;
};

/** Opens the delete confirmation dialog for the selected vehicle */
const onDelete = (row: Vehicle): void => {
    deleteTarget.value = row;
    deleteVisible.value = true;
};

/** Deletes the selected vehicle once the deletion is confirmed */
const onConfirmDelete = (): void => {
    const target = deleteTarget.value;
    if (!target) return;
    deleteVehicle(target.id);
    toast.add({
        severity: 'success',
        summary: t('objects.vehicles.modal.deleted'),
        detail: `${target.brand} ${target.model}`,
        life: 2000
    });
};
</script>
