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
            <InputNumber
                id="vehConsumptionAverage"
                v-model="state.consumptionAverage"
                :min="0"
                :max-fraction-digits="1"
                :placeholder="$t('objects.vehicles.modal.consumptionUnit')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehConsumptionSlow"
            name="consumptionSlow"
            :label="$t('objects.vehicles.modal.consumptionSlow')"
        >
            <InputNumber
                id="vehConsumptionSlow"
                v-model="state.consumptionSlow"
                :min="0"
                :max-fraction-digits="1"
                :placeholder="$t('objects.vehicles.modal.consumptionUnit')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehConsumptionNormal"
            name="consumptionNormal"
            :label="$t('objects.vehicles.modal.consumptionNormal')"
        >
            <InputNumber
                id="vehConsumptionNormal"
                v-model="state.consumptionNormal"
                :min="0"
                :max-fraction-digits="1"
                :placeholder="$t('objects.vehicles.modal.consumptionUnit')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehConsumptionFast"
            name="consumptionFast"
            :label="$t('objects.vehicles.modal.consumptionFast')"
        >
            <InputNumber
                id="vehConsumptionFast"
                v-model="state.consumptionFast"
                :min="0"
                :max-fraction-digits="1"
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
            <InputNumber
                id="vehTankMain"
                v-model="state.tankMain"
                :use-grouping="false"
                :min="0"
                :placeholder="$t('objects.vehicles.modal.tankUnit')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehTankExtra"
            name="tankExtra"
            :label="$t('objects.vehicles.modal.tankExtra')"
        >
            <InputNumber
                id="vehTankExtra"
                v-model="state.tankExtra"
                :use-grouping="false"
                :min="0"
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
            <InputNumber
                id="vehSpeedNormal"
                v-model="state.speedNormal"
                :use-grouping="false"
                :min="0"
                :placeholder="$t('objects.vehicles.modal.speedUnit')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehSpeedMax"
            name="speedMax"
            :label="$t('objects.vehicles.modal.speedMax')"
        >
            <InputNumber
                id="vehSpeedMax"
                v-model="state.speedMax"
                :use-grouping="false"
                :min="0"
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
