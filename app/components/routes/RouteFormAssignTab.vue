<template>
    <div class="flex flex-col gap-4 pb-5">
        <h3 class="font-semibold text-surface-900">
            {{ $t('routes.create.assignment.title') }}
        </h3>

        <SharedAppFormField
            id="routeVehicles"
            name="vehicles"
            :label="$t('routes.create.assignment.vehicles')"
        >
            <UiMultiSelect
                v-model="state.vehicleIds"
                input-id="routeVehicles"
                :options="vehicleOptions"
                option-label="label"
                option-value="value"
                display="chip"
                filter
                :placeholder="
                    $t('routes.create.assignment.vehiclesPlaceholder')
                "
                fluid
                show-select-all
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="routeGroups"
            name="groups"
            :label="$t('routes.create.assignment.groups')"
        >
            <UiMultiSelect
                v-model="state.groupIds"
                input-id="routeGroups"
                :options="groupOptions"
                option-label="label"
                option-value="value"
                display="chip"
                filter
                :placeholder="$t('routes.create.assignment.groupsPlaceholder')"
                fluid
                show-select-all
            />
        </SharedAppFormField>
    </div>
</template>

<script setup lang="ts">
import { useRouteFormContext } from '~/composables/useRouteForm';

/** Option of the vehicle / group multiselects */
interface AssignOption {
    label: string;
    value: string;
}

/** «Призначення» tab: optional vehicle and group assignments. */

const { state } = useRouteFormContext();

const { vehicles } = useVehicles();
const { groups } = useGroups();

/** Vehicle multiselect options, labelled like «MAN TGX 18.480 (ID: TRK-112)» */
const vehicleOptions = computed<AssignOption[]>(() =>
    vehicles.value.map((vehicle) => ({
        label: `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`,
        value: vehicle.id
    }))
);

/** Group multiselect options (label: group name, value: group id) */
const groupOptions = computed<AssignOption[]>(() =>
    groups.value.map((group) => ({ label: group.name, value: group.id }))
);
</script>
