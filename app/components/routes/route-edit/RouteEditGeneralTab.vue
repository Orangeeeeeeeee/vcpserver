<template>
    <div class="flex flex-col gap-4">
        <SharedAppFormField
            id="routeEditName"
            name="name"
            :label="$t('routes.edit.general.name')"
            :error="r$.$fields.name.$errors"
        >
            <InputText
                id="routeEditName"
                v-model="state.name"
                :placeholder="$t('routes.edit.general.namePlaceholder')"
                :invalid="r$.$fields.name.$error"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="routeEditStatus"
            name="status"
            :label="$t('routes.edit.general.status')"
        >
            <Select
                v-model="state.status"
                input-id="routeEditStatus"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                :placeholder="$t('routes.edit.general.statusPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="routeEditVehicles"
            name="vehicles"
            :label="$t('routes.edit.general.vehicles')"
        >
            <UiMultiSelect
                v-model="state.vehicleIds"
                input-id="routeEditVehicles"
                :options="vehicleOptions"
                option-label="label"
                option-value="value"
                display="chip"
                filter
                show-select-all
                :placeholder="$t('routes.edit.general.vehiclesPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="routeEditGroups"
            name="groups"
            :label="$t('routes.edit.general.groups')"
        >
            <UiMultiSelect
                v-model="state.groupIds"
                input-id="routeEditGroups"
                :options="groupOptions"
                option-label="label"
                option-value="value"
                display="chip"
                filter
                show-select-all
                :placeholder="$t('routes.edit.general.groupsPlaceholder')"
                fluid
            />
        </SharedAppFormField>
    </div>
</template>

<script setup lang="ts">
import { useRouteEditFormContext } from '~/composables/useRouteEditForm';
import { ROUTE_STATUSES, ROUTE_STATUS_META } from '~/constants/route-list';
import type { RouteStatus } from '~/types/route';

/** Option of the status / vehicle / group selects */
interface EditOption<T extends string = string> {
    label: string;
    value: T;
}

/** «Основне» tab of the route edit dialog: name, status and assignments. */

const { t } = useI18n();
const { state, r$ } = useRouteEditFormContext();

const { vehicles } = useVehicles();
const { groups } = useGroups();

/** Status select options built from the status metadata */
const statusOptions = computed<EditOption<RouteStatus>[]>(() =>
    ROUTE_STATUSES.map((status) => ({
        label: t(ROUTE_STATUS_META[status].labelKey),
        value: status
    }))
);

/** Vehicle multiselect options, labelled like «MAN TGX 18.480 (ID: TRK-112)» */
const vehicleOptions = computed<EditOption[]>(() =>
    vehicles.value.map((vehicle) => ({
        label: `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`,
        value: vehicle.id
    }))
);

/** Group multiselect options (label: group name, value: group id) */
const groupOptions = computed<EditOption[]>(() =>
    groups.value.map((group) => ({ label: group.name, value: group.id }))
);
</script>
