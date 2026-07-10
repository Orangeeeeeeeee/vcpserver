<template>
    <div class="flex flex-col gap-2 md:gap-4">
        <!-- Filter bar -->
        <div class="flex flex-col gap-2 md:flex-row">
            <div class="flex flex-wrap items-center gap-3 md:flex-nowrap">
                <IconField class="flex-1 min-w-0 md:flex-none md:w-72">
                    <InputIcon>
                        <Icon
                            name="tabler:search"
                            class="size-5 text-surface-700"
                        />
                    </InputIcon>
                    <InputText
                        v-model="searchQuery"
                        :placeholder="$t('routes.groups.searchPlaceholder')"
                        fluid
                    />
                </IconField>
                <div class="w-full flex-1 md:w-auto md:grow-0">
                    <RoutesGroupsFilters />
                </div>
            </div>
            <div
                v-if="filters.state.companies.length"
                class="flex flex-wrap items-center gap-2 justify-end grow-1"
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

        <!-- Groups grid + paginator OR empty banner -->
        <template v-if="filteredGroups.length > 0">
            <div
                class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4"
            >
                <RoutesGroupsCard
                    v-for="group in paginatedGroups"
                    :key="group.id"
                    :group="group"
                    :routes="groupRoutesOf(group)"
                    :labels="cardLabels"
                    @edit="onEdit"
                    @delete="onDelete"
                />
            </div>

            <UiPagination v-model:page="currentPage" :page-count="pageCount" />
        </template>
        <SharedTableEmpty
            v-else
            :message="$t('common.emptyMessage')"
            :reset-label="$t('common.resetFilters')"
            @reset="onResetFilters"
        />

        <RoutesGroupsFormDialog
            v-model:visible="formVisible"
            :group="formTarget"
        />

        <SharedConfirmDeleteDialog
            v-model:visible="deleteVisible"
            group="confirmDeleteRouteGroup"
            :title="$t('routes.groups.modal.deleteTitle')"
            :message="$t('routes.groups.modal.deleteSubtitle')"
            :item-name="deleteTarget?.name"
            :warning="$t('common.deleteWarning')"
            @confirm="onConfirmDelete"
        />

        <!-- Teleports -->
        <Teleport :to="actionsTarget">
            <UiActionButton
                icon="tabler:plus"
                :label="$t('routes.groups.add')"
                @click="onAdd"
            />
        </Teleport>

        <Teleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:route', to: ROUTES.ROUTES_PAGE },
                    { label: $t('routes.tabs.groups') }
                ]"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { RouteGroup } from '~/types/route-group';
import type {
    RouteGroupCardLabels,
    RouteGroupCardRoute
} from '~/components/routes/groups/GroupsCard.vue';
import { ROUTES } from '~/constants/routes';
import {
    useRouteGroupFilters,
    ROUTE_GROUP_FILTERS_KEY
} from '~/composables/useRouteGroupFilters';

const ROWS_PER_PAGE = 8;

const { t } = useI18n();
const toast = useToast();
const { routeGroups, deleteRouteGroup } = useRouteGroups();
const { routes } = useRoutes();

/** Shared filter state/options, provided to the GroupsFilters popover */
const filters = useRouteGroupFilters();
provide(ROUTE_GROUP_FILTERS_KEY, filters);

const searchQuery = ref('');
const currentPage = ref<number>(0);
const formVisible = ref<boolean>(false);
const formTarget = ref<RouteGroup | null>(null);
const deleteVisible = ref<boolean>(false);
const deleteTarget = ref<RouteGroup | null>(null);

const isTablet = useMediaQuery('(min-width: 768px)');
/** PageLayout slot to teleport the add button into — mobile sits next to title, desktop next to tabs */
const actionsTarget = computed((): string =>
    isTablet.value ? '#page-actions-target' : '#page-actions-header'
);

/** Groups filtered by name + filter predicate, sorted by manual order */
const filteredGroups = computed<RouteGroup[]>(() => {
    const q = searchQuery.value.trim().toLowerCase();
    return routeGroups.value
        .filter((g) => {
            const matchesName = !q || g.name.toLowerCase().includes(q);
            return matchesName && filters.matches(g);
        })
        .sort((a, b) => a.order - b.order);
});

/** Total number of pages for the current filtered list */
const pageCount = computed<number>(() =>
    Math.ceil(filteredGroups.value.length / ROWS_PER_PAGE)
);

/** Slice of filteredGroups for the current page */
const paginatedGroups = computed<RouteGroup[]>(() =>
    filteredGroups.value.slice(
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

/** i18n labels passed into each RoutesGroupsCard */
const cardLabels = computed<RouteGroupCardLabels>(() => ({
    statusActive: t('routes.groups.card.statusActive'),
    statusInactive: t('routes.groups.card.statusInactive'),
    expand: t('routes.groups.card.expand'),
    collapse: t('routes.groups.card.collapse'),
    menuEdit: t('common.edit'),
    menuDelete: t('common.delete')
}));

/** Resolves group route ids to display rows; deleted routes are skipped */
const groupRoutesOf = (group: RouteGroup): RouteGroupCardRoute[] =>
    group.routeIds
        .map((id) => routes.value.find((r) => r.id === id))
        .filter((r): r is NonNullable<typeof r> => r !== undefined)
        .map((r) => ({ id: r.id, name: r.name }));

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

/** Opens the form dialog in edit mode (pre-filled from the group) */
const onEdit = (group: RouteGroup): void => {
    formTarget.value = group;
    formVisible.value = true;
};

/** Opens the delete confirmation dialog for the selected group */
const onDelete = (group: RouteGroup): void => {
    deleteTarget.value = group;
    deleteVisible.value = true;
};

/** Deletes the selected group once the deletion is confirmed */
const onConfirmDelete = (): void => {
    const target = deleteTarget.value;
    if (!target) return;
    deleteRouteGroup(target.id);
    toast.add({
        severity: 'success',
        summary: t('routes.groups.modal.deleted'),
        detail: target.name,
        life: 2000
    });
};
</script>
