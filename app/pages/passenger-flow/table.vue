<template>
    <div class="flex flex-col gap-4">
        <h2 class="text-lg text-surface-900">
            {{ $t('passengerFlow.table.title') }}
        </h2>

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
                    :placeholder="$t('common.search')"
                    fluid
                />
            </IconField>
        </div>

        <!-- Table -->
        <SharedResponsiveTable
            v-if="filteredRecords.length > 0"
            :value="filteredRecords"
            :columns="columns"
            paginator
            hoverable
            :rows="9"
            row-key="id"
        >
            <template #cell-transport="{ row }">
                <div class="flex flex-col gap-[0.125rem] leading-none">
                    <span class="font-semibold text-surface-950">
                        {{ row.transport }}
                    </span>
                    <span class="text-surface-600">
                        ID: {{ row.transportId }}
                    </span>
                </div>
            </template>
            <template #cell-group="{ row }">
                <div>
                    <span
                        class="inline-flex items-center rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700"
                    >
                        {{ row.group }}
                    </span>
                </div>
            </template>
            <template #cell-driver="{ row }">
                <div class="flex items-center gap-1.5">
                    <Icon name="tabler:user" class="size-5 text-surface-600" />
                    <span class="text-surface-800">{{ row.driver }}</span>
                </div>
            </template>
            <template #cell-trips="{ row, rowHovered }">
                <div>
                    <Chip
                        class="text-xs font-medium transition"
                        :class="rowHovered ? 'bg-surface-300' : ''"
                        :label="String(row.trips)"
                    />
                </div>
            </template>
            <template #cell-distance="{ row }">
                <span class="font-medium text-surface-900">
                    {{
                        $t('passengerFlow.table.distanceValue', {
                            value: row.distance
                        })
                    }}
                </span>
            </template>
            <template #cell-profit="{ row }">
                <span class="text-surface-800">
                    {{
                        $t('passengerFlow.table.profitValue', {
                            value: row.profit
                        })
                    }}
                </span>
            </template>
            <template #cell-actions="{ row }">
                <NuxtLink
                    class="flex cursor-pointer items-center gap-1 text-primary-900 font-medium"
                    :to="
                        ROUTES.PASSENGER_FLOW_TRANSPORT_DETAIL(row.transportId)
                    "
                >
                    <span>{{ $t('passengerFlow.table.columns.goto') }}</span>
                    <Icon
                        name="tabler:arrow-up-right"
                        class="size-5 text-primary-600"
                    />
                </NuxtLink>
            </template>
        </SharedResponsiveTable>
        <SharedTableEmpty
            v-else
            :message="$t('passengerFlow.table.emptyMessage')"
            :reset-label="$t('passengerFlow.table.resetFilters')"
            @reset="onResetFilters"
        />
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '~/components/shared/ResponsiveTable';
import type { PassengerFlowRecord } from '~/types/passenger-flow';
import { ROUTES } from '~/constants/routes';

const { t } = useI18n();
const { records } = usePassengerFlow();
const { selectedGroups } = usePassengerFlowGroupFilter();

const searchQuery = ref('');

const columns = computed<TableColumn[]>(() => [
    {
        field: 'transport',
        header: t('passengerFlow.table.columns.transport'),
        sortable: true
    },
    {
        field: 'group',
        header: t('passengerFlow.table.columns.group')
    },
    {
        field: 'driver',
        header: t('passengerFlow.table.columns.driver')
    },
    {
        field: 'trips',
        header: t('passengerFlow.table.columns.trips'),
        sortable: true
    },
    {
        field: 'distance',
        header: t('passengerFlow.table.columns.distance'),
        sortable: true
    },
    {
        field: 'passengers',
        header: t('passengerFlow.table.columns.passengers'),
        sortable: true
    },
    {
        field: 'profit',
        header: t('passengerFlow.table.columns.profit'),
        sortable: true
    },
    {
        field: 'actions',
        header: '',
        align: 'right'
    }
]);

/** Records filtered by transport / transport id / driver substring and selected groups */
const filteredRecords = computed((): PassengerFlowRecord[] => {
    const q = searchQuery.value.trim().toLowerCase();

    return records.value.filter((item) => {
        const matchesQuery =
            !q ||
            item.transport.toLowerCase().includes(q) ||
            item.transportId.toLowerCase().includes(q) ||
            item.driver.toLowerCase().includes(q);

        const matchesGroup =
            selectedGroups.value.length === 0 ||
            selectedGroups.value.includes(item.group);

        return matchesQuery && matchesGroup;
    });
});

/** Resets the search and group filters back to default */
const onResetFilters = (): void => {
    searchQuery.value = '';
    selectedGroups.value = [];
};
</script>
