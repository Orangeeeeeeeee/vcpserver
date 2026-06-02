<template>
    <div class="flex flex-col gap-4">
        <!-- Filter bar -->
        <div class="flex flex-wrap items-center gap-3">
            <IconField class="flex-1 min-w-0 md:flex-none md:w-72">
                <InputIcon>
                    <Icon
                        name="tabler:search"
                        class="size-5 text-[var(--p-surface-700)]"
                    />
                </InputIcon>
                <InputText
                    v-model="searchQuery"
                    :placeholder="$t('objects.drivers.searchPlaceholder')"
                    fluid
                />
            </IconField>
            <Button
                :label="$t('objects.drivers.filterButton')"
                severity="secondary"
                outlined
                @click="onFilterClick"
            >
                <template #icon>
                    <Icon name="tabler:filter" class="size-5" />
                </template>
            </Button>
        </div>

        <!-- Drivers grid + paginator OR empty banner -->
        <template v-if="filteredDrivers.length > 0">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <ObjectsDriverCard
                    v-for="driver in paginatedDrivers"
                    :key="driver.id"
                    :driver="driver"
                    :labels="cardLabels"
                    @details="onDetails"
                    @edit="onEdit"
                    @delete="onDelete"
                />
            </div>

            <Paginator
                v-model:first="paginatorFirst"
                :rows="ROWS_PER_PAGE"
                :total-records="filteredDrivers.length"
            />
        </template>
        <SharedTableEmpty
            v-else
            :message="$t('objects.drivers.emptyMessage')"
            :reset-label="$t('objects.drivers.resetFilters')"
            @reset="onResetFilters"
        />

        <!-- Teleports -->
        <Teleport to="#page-actions-target">
            <Button
                :label="$t('objects.add')"
                severity="secondary"
                @click="onAdd"
            >
                <template #icon>
                    <Icon name="tabler:plus" class="size-5" />
                </template>
            </Button>
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
import type {
    Driver,
    DriverCardLabels
} from '~/components/objects/DriverCard.vue';
import { ROUTES } from '~/constants/routes';

const ROWS_PER_PAGE = 8;

const { t } = useI18n();
const toast = useToast();
const { drivers } = useDrivers();

const searchQuery = ref('');
const paginatorFirst = ref<number>(0);

/** Drivers filtered by name (case-insensitive substring) */
const filteredDrivers = computed<Driver[]>(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return drivers.value;
    return drivers.value.filter((d) => d.name.toLowerCase().includes(q));
});

/** Slice of filteredDrivers for the current paginator page */
const paginatedDrivers = computed<Driver[]>(() =>
    filteredDrivers.value.slice(
        paginatorFirst.value,
        paginatorFirst.value + ROWS_PER_PAGE
    )
);

/** Reset paginator to first page whenever the search filter changes */
watch(searchQuery, () => {
    paginatorFirst.value = 0;
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
    menuEdit: t('objects.drivers.card.menuEdit'),
    menuDelete: t('objects.drivers.card.menuDelete')
}));

/** Helper to show a placeholder toast for stubbed actions */
const placeholderToast = (summary: string, detail: string): void => {
    toast.add({ severity: 'info', summary, detail, life: 2000 });
};

/** Resets the search filter (the filter button itself is still a placeholder) */
const onResetFilters = (): void => {
    searchQuery.value = '';
};

const onAdd = (): void =>
    placeholderToast(t('objects.add'), t('objects.drivers.inDevelopment'));

const onFilterClick = (): void =>
    placeholderToast(
        t('objects.drivers.filterButton'),
        t('objects.drivers.inDevelopment')
    );

const onDetails = (driver: Driver): void =>
    placeholderToast(t('objects.drivers.card.menuDetails'), driver.name);

const onEdit = (driver: Driver): void =>
    placeholderToast(t('objects.drivers.card.menuEdit'), driver.name);

const onDelete = (driver: Driver): void =>
    placeholderToast(t('objects.drivers.card.menuDelete'), driver.name);
</script>
