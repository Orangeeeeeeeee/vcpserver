<template>
    <div class="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
        <span
            class="text-base font-semibold text-surface-950 md:col-span-2"
        >
            {{ $t('objects.vehicles.modal.sections.initialData') }}
        </span>

        <SharedAppFormField
            id="vehOdometer"
            name="odometer"
            :label="$t('objects.vehicles.modal.odometer')"
        >
            <InputNumber
                id="vehOdometer"
                v-model="state.odometer"
                :use-grouping="false"
                :min="0"
                :placeholder="
                    $t('objects.vehicles.modal.odometerPlaceholder')
                "
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehOdometerDate"
            name="odometerDate"
            :label="$t('objects.vehicles.modal.date')"
        >
            <DatePicker
                id="vehOdometerDate"
                v-model="state.odometerDate"
                date-format="dd.mm.yy"
                show-icon
                icon-display="input"
                :placeholder="$t('objects.vehicles.modal.datePlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehEngineHours"
            name="engineHours"
            :label="$t('objects.vehicles.modal.engineHours')"
        >
            <InputNumber
                id="vehEngineHours"
                v-model="state.engineHours"
                :use-grouping="false"
                :min="0"
                :placeholder="
                    $t('objects.vehicles.modal.engineHoursPlaceholder')
                "
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehEngineHoursDate"
            name="engineHoursDate"
            :label="$t('objects.vehicles.modal.date')"
        >
            <DatePicker
                id="vehEngineHoursDate"
                v-model="state.engineHoursDate"
                date-format="dd.mm.yy"
                show-icon
                icon-display="input"
                :placeholder="$t('objects.vehicles.modal.datePlaceholder')"
                fluid
            />
        </SharedAppFormField>
    </div>
</template>

<script setup lang="ts">
import { useVehicleFormContext } from '~/composables/useVehicleForm';

const { state } = useVehicleFormContext();
</script>
