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
                    :placeholder="$t('objects.drivers.searchPlaceholder')"
                    fluid
                />
            </IconField>
            <ObjectsDriverFilters />
        </div>

        <!-- Drivers grid + paginator OR empty banner -->
        <template v-if="filteredDrivers.length > 0">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <NuxtLink
                    v-for="driver in paginatedDrivers"
                    :key="driver.id"
                    :to="ROUTES.DRIVER_DETAIL(driver.id)"
                >
                    <ObjectsDriverCard
                        :driver="driver"
                        :labels="cardLabels"
                        @details="onDetails"
                        @edit="onEdit"
                        @delete="onDelete"
                    />
                </NuxtLink>
            </div>

            <UiPagination v-model:page="currentPage" :page-count="pageCount" />
        </template>
        <SharedTableEmpty
            v-else
            :message="$t('common.emptyMessage')"
            :reset-label="$t('common.resetFilters')"
            @reset="onResetFilters"
        />

        <ObjectsDriverFormDialog
            v-model:visible="formVisible"
            :driver="formTarget"
        />

        <SharedConfirmDeleteDialog
            v-model:visible="deleteVisible"
            :title="$t('objects.drivers.modal.deleteTitle')"
            :message="$t('objects.drivers.modal.deleteSubtitle')"
            :item-name="deleteTarget?.name"
            :warning="$t('common.deleteWarning')"
            @confirm="onConfirmDelete"
        />

        <!-- Teleports -->
        <Teleport to="#page-actions-target">
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
                    { label: $t('objects.tabs.drivers') }
                ]"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { Driver } from '~/types/driver';
import type { DriverCardLabels } from '~/components/objects/DriverCard.vue';
import { ROUTES } from '~/constants/routes';
import {
    useDriverFilters,
    DRIVER_FILTERS_KEY
} from '~/composables/useDriverFilters';

const ROWS_PER_PAGE = 8;

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const { drivers, deleteDriver } = useDrivers();

/** Shared filter state/options, provided to the DriverFilters popover */
const filters = useDriverFilters();
provide(DRIVER_FILTERS_KEY, filters);

const searchQuery = ref('');
const currentPage = ref<number>(0);
const formVisible = ref<boolean>(false);
const formTarget = ref<Driver | null>(null);
const deleteVisible = ref<boolean>(false);
const deleteTarget = ref<Driver | null>(null);

/** Drivers filtered by name (substring) AND the filter-popover predicate */
const filteredDrivers = computed<Driver[]>(() => {
    const q = searchQuery.value.trim().toLowerCase();
    return drivers.value.filter((d) => {
        const matchesName = !q || d.name.toLowerCase().includes(q);
        return matchesName && filters.matches(d);
    });
});

/** Total number of pages for the current filtered list */
const pageCount = computed<number>(() =>
    Math.ceil(filteredDrivers.value.length / ROWS_PER_PAGE)
);

/** Slice of filteredDrivers for the current page */
const paginatedDrivers = computed<Driver[]>(() =>
    filteredDrivers.value.slice(
        currentPage.value * ROWS_PER_PAGE,
        currentPage.value * ROWS_PER_PAGE + ROWS_PER_PAGE
    )
);

/** Reset paginator to first page whenever the search OR filters change */
watch(
    [searchQuery, () => filters.state],
    () => {
        currentPage.value = 0;
    },
    { deep: true }
);

/** Clamp the current page when the page count shrinks below it */
watch(pageCount, (count): void => {
    if (currentPage.value > Math.max(0, count - 1)) {
        currentPage.value = Math.max(0, count - 1);
    }
});

/** i18n labels passed into each DriverCard */
const cardLabels = computed<DriverCardLabels>(() => ({
    statusActive: t('objects.drivers.card.statusActive'),
    statusBlocked: t('objects.drivers.card.statusBlocked'),
    statusVacation: t('objects.drivers.card.statusVacation'),
    statusUnavailable: t('objects.drivers.card.statusUnavailable'),
    licenseSection: t('objects.drivers.card.licenseSection'),
    startedAtLabel: t('objects.drivers.card.startedAtLabel'),
    employmentLabel: t('objects.drivers.card.employmentLabel'),
    menuDetails: t('objects.drivers.card.menuDetails'),
    menuEdit: t('common.edit'),
    menuDelete: t('common.delete')
}));

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

/** Navigates to the driver detail page */
const onDetails = (driver: Driver): void => {
    router.push(ROUTES.DRIVER_DETAIL(driver.id));
};

/** Opens the form dialog in edit mode (pre-filled from the driver) */
const onEdit = (driver: Driver): void => {
    formTarget.value = driver;
    formVisible.value = true;
};

/** Opens the delete confirmation dialog for the selected driver */
const onDelete = (driver: Driver): void => {
    deleteTarget.value = driver;
    deleteVisible.value = true;
};

/** Deletes the selected driver once the deletion is confirmed */
const onConfirmDelete = (): void => {
    const target = deleteTarget.value;
    if (!target) return;
    deleteDriver(target.id);
    toast.add({
        severity: 'success',
        summary: t('objects.drivers.modal.deleted'),
        detail: target.name,
        life: 2000
    });
};
</script>
