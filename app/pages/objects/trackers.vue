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
                    :placeholder="$t('objects.trackers.searchPlaceholder')"
                    fluid
                />
            </IconField>

            <MultiSelect
                v-model="selectedCompanies"
                :options="companies"
                :placeholder="$t('objects.trackers.allCompanies')"
                class="w-40 md:w-56"
                :pt="{ label: { class: 'p-placeholder' } }"
            >
                <template #value>
                    {{ $t('objects.trackers.allCompanies') }}
                </template>
            </MultiSelect>

            <div
                v-if="selectedCompanies.length"
                class="flex flex-wrap items-center gap-2 basis-full md:basis-auto md:ml-auto"
            >
                <Chip
                    v-for="company in selectedCompanies"
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

        <!-- Table -->
        <SharedResponsiveTable
            v-if="filteredTrackers.length > 0"
            :value="filteredTrackers"
            :columns="columns"
            paginator
            :rows="9"
            row-key="id"
        >
            <template #cell-company="{ row }">
                <div class="flex items-center gap-1">
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
            <template #cell-transport="{ row }">
                <div class="flex flex-col gap-[0.125rem] leading-none">
                    <span class="font-semibold">
                        {{ row.transport }}
                    </span>
                    <span class="text-surface-600">
                        ID: {{ row.transportId }}
                    </span>
                </div>
            </template>
            <template #cell-imei="{ row }">
                <span class="text-surface-900">{{ row.imei }}</span>
            </template>
            <template #cell-port="{ row }">
                <span class="font-medium">{{ row.port }}</span>
            </template>
            <template #cell-params="{ row }">
                <div>
                    <Chip
                        severity="primary"
                        class="text-xs font-medium"
                        :label="String(row.params.length)"
                    ></Chip>
                </div>
            </template>
            <template #cell-actions="{ row }">
                <div class="flex items-center gap-2 justify-end">
                    <UiActionCommonButton @click="onEdit(row)">
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
                        @click="onDelete(row)"
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
                    { label: $t('objects.tabs.trackers') }
                ]"
            />
        </Teleport>

        <ObjectsTrackerFormDialog
            v-model:visible="formVisible"
            :tracker="formTarget"
        />

        <SharedConfirmDeleteDialog
            v-model:visible="deleteVisible"
            :title="$t('objects.trackers.modal.deleteTitle')"
            :message="$t('objects.trackers.modal.deleteSubtitle')"
            :item-name="deleteTarget?.transport"
            :warning="$t('common.deleteWarning')"
            @confirm="onConfirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { TableColumn } from '~/components/shared/ResponsiveTable';
import type { Tracker } from '~/types/tracker';
import { ROUTES } from '~/constants/routes';

const { t } = useI18n();
const toast = useToast();
const { trackers, companies, deleteTracker } = useTrackers();

const searchQuery = ref('');
const selectedCompanies = ref<string[]>([]);
const formVisible = ref<boolean>(false);
const formTarget = ref<Tracker | null>(null);
const deleteVisible = ref<boolean>(false);
const deleteTarget = ref<Tracker | null>(null);

const isTablet = useMediaQuery('(min-width: 768px)');
/** PageLayout slot to teleport the add button into — mobile sits next to title, desktop next to tabs */
const actionsTarget = computed((): string =>
    isTablet.value ? '#page-actions-target' : '#page-actions-header'
);

const columns = computed<TableColumn[]>(() => [
    {
        field: 'company',
        header: t('objects.trackers.columns.company'),
        sortable: true
    },
    {
        field: 'imei',
        header: t('objects.trackers.columns.imei'),
        sortable: true
    },
    {
        field: 'port',
        header: t('objects.trackers.columns.port'),
        sortable: true,
        width: '150px'
    },
    {
        field: 'transport',
        header: t('objects.trackers.columns.transport'),
        sortable: true
    },
    {
        field: 'params',
        header: t('objects.trackers.columns.params'),
        sortable: true,
        width: '200px'
    },
    {
        field: 'actions',
        header: t('objects.trackers.columns.actions'),
        align: 'right',
        width: '100px'
    }
]);

/** Trackers filtered by IMEI substring + company multi-select */
const filteredTrackers = computed((): Tracker[] => {
    let arr: Tracker[] = trackers.value;
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase();
        arr = arr.filter((item) => item.imei.toLowerCase().includes(q));
    }
    if (selectedCompanies.value.length) {
        arr = arr.filter((item) =>
            selectedCompanies.value.includes(item.company)
        );
    }
    return arr;
});

/** Removes a company from the multi-select filter */
const removeCompany = (company: string): void => {
    selectedCompanies.value = selectedCompanies.value.filter(
        (c) => c !== company
    );
};

/** Resets search and company filters back to default */
const onResetFilters = (): void => {
    searchQuery.value = '';
    selectedCompanies.value = [];
};

/** Opens the form dialog in add mode (empty fields) */
const onAdd = (): void => {
    formTarget.value = null;
    formVisible.value = true;
};

/** Opens the form dialog in edit mode prefilled with the selected tracker */
const onEdit = (row: Tracker): void => {
    formTarget.value = row;
    formVisible.value = true;
};

/** Opens the delete confirmation dialog for the selected tracker */
const onDelete = (row: Tracker): void => {
    deleteTarget.value = row;
    deleteVisible.value = true;
};

/** Deletes the selected tracker once the deletion is confirmed */
const onConfirmDelete = (): void => {
    const target = deleteTarget.value;
    if (!target) return;
    deleteTracker(target.id);
    toast.add({
        severity: 'success',
        summary: t('objects.trackers.actions.deleted'),
        detail: target.imei,
        life: 2000
    });
};
</script>
