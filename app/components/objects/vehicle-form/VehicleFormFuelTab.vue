<template>
    <div class="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
        <span
            class="text-base font-semibold text-surface-950 md:col-span-2"
        >
            {{ $t('objects.vehicles.modal.sections.consumption') }}
        </span>

        <SharedAppFormField
            id="vehConsumptionAverage"
            name="consumptionAverage"
            :label="$t('objects.vehicles.modal.consumptionAverage')"
        >
            <UiInputNumber
                id="vehConsumptionAverage"
                v-model="state.consumptionAverage"
                :placeholder="$t('objects.vehicles.modal.consumptionUnit')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehConsumptionSlow"
            name="consumptionSlow"
            :label="$t('objects.vehicles.modal.consumptionSlow')"
        >
            <UiInputNumber
                id="vehConsumptionSlow"
                v-model="state.consumptionSlow"
                :placeholder="$t('objects.vehicles.modal.consumptionUnit')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehConsumptionNormal"
            name="consumptionNormal"
            :label="$t('objects.vehicles.modal.consumptionNormal')"
        >
            <UiInputNumber
                id="vehConsumptionNormal"
                v-model="state.consumptionNormal"
                :placeholder="$t('objects.vehicles.modal.consumptionUnit')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehConsumptionFast"
            name="consumptionFast"
            :label="$t('objects.vehicles.modal.consumptionFast')"
        >
            <UiInputNumber
                id="vehConsumptionFast"
                v-model="state.consumptionFast"
                :placeholder="$t('objects.vehicles.modal.consumptionUnit')"
                fluid
            />
        </SharedAppFormField>

        <span
            class="text-base font-semibold text-surface-950 md:col-span-2"
        >
            {{ $t('objects.vehicles.modal.sections.tanks') }}
        </span>

        <SharedAppFormField
            id="vehTankMain"
            name="tankMain"
            :label="$t('objects.vehicles.modal.tankMain')"
        >
            <UiInputNumber
                id="vehTankMain"
                v-model="state.tankMain"
                :placeholder="$t('objects.vehicles.modal.tankUnit')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehTankExtra"
            name="tankExtra"
            :label="$t('objects.vehicles.modal.tankExtra')"
        >
            <UiInputNumber
                id="vehTankExtra"
                v-model="state.tankExtra"
                :placeholder="$t('objects.vehicles.modal.tankUnit')"
                fluid
            />
        </SharedAppFormField>

        <span
            class="text-base font-semibold text-surface-950 md:col-span-2"
        >
            {{ $t('objects.vehicles.modal.sections.speedLimits') }}
        </span>

        <SharedAppFormField
            id="vehSpeedNormal"
            name="speedNormal"
            :label="$t('objects.vehicles.modal.speedNormal')"
        >
            <UiInputNumber
                id="vehSpeedNormal"
                v-model="state.speedNormal"
                :placeholder="$t('objects.vehicles.modal.speedUnit')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehSpeedMax"
            name="speedMax"
            :label="$t('objects.vehicles.modal.speedMax')"
        >
            <UiInputNumber
                id="vehSpeedMax"
                v-model="state.speedMax"
                :placeholder="$t('objects.vehicles.modal.speedUnit')"
                fluid
            />
        </SharedAppFormField>
    </div>
</template>

<script setup lang="ts">
import { useVehicleFormContext } from '~/composables/useVehicleForm';

const { state } = useVehicleFormContext();
</script>
