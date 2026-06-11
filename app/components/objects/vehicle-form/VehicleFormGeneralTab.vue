<template>
    <div class="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
        <SharedAppFormField
            id="vehCompany"
            name="company"
            :label="$t('objects.vehicles.modal.company')"
            :error="r$.$fields.company.$errors[0]"
        >
            <Select
                id="vehCompany"
                v-model="state.company"
                :options="companies"
                :placeholder="$t('objects.vehicles.modal.companyPlaceholder')"
                :invalid="r$.$fields.company.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehYear"
            name="year"
            :label="$t('objects.vehicles.modal.year')"
        >
            <InputNumber
                id="vehYear"
                v-model="state.year"
                :use-grouping="false"
                :min="1900"
                :max="2026"
                :placeholder="$t('objects.vehicles.modal.yearPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehName"
            name="name"
            :label="$t('objects.vehicles.modal.name')"
            :error="r$.$fields.name.$errors[0]"
        >
            <InputText
                id="vehName"
                v-model="state.name"
                :placeholder="$t('objects.vehicles.modal.namePlaceholder')"
                :invalid="r$.$fields.name.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehVin"
            name="vin"
            :label="$t('objects.vehicles.modal.vin')"
        >
            <InputText
                id="vehVin"
                v-model="state.vin"
                :placeholder="$t('objects.vehicles.modal.vinPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehType"
            name="type"
            :label="$t('objects.vehicles.modal.type')"
            :error="r$.$fields.type.$errors[0]"
        >
            <Select
                id="vehType"
                v-model="state.type"
                :options="typeOptions"
                option-label="label"
                option-value="value"
                :placeholder="$t('objects.vehicles.modal.typePlaceholder')"
                :invalid="r$.$fields.type.$invalid"
                fluid
            >
                <template #option="{ option }">
                    <span class="flex items-center gap-2">
                        <Icon
                            :name="option.icon"
                            class="size-5 text-surface-700"
                        />
                        <span>{{ option.label }}</span>
                    </span>
                </template>
                <template #value="{ value, placeholder }">
                    <span v-if="value" class="flex items-center gap-2">
                        <Icon
                            :name="VEHICLE_TYPE_ICONS[value as VehicleType]"
                            class="size-5 text-surface-700"
                        />
                        <span>{{ typeLabelOf(value) }}</span>
                    </span>
                    <span v-else>{{ placeholder }}</span>
                </template>
            </Select>
        </SharedAppFormField>

        <SharedAppFormField
            id="vehFuel"
            name="fuel"
            :label="$t('objects.vehicles.modal.fuel')"
        >
            <Select
                id="vehFuel"
                v-model="state.fuel"
                :options="fuelOptions"
                option-label="label"
                option-value="value"
                :placeholder="$t('objects.vehicles.modal.fuelPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehBrand"
            name="brand"
            :label="$t('objects.vehicles.modal.brand')"
        >
            <InputText
                id="vehBrand"
                v-model="state.brand"
                :placeholder="$t('objects.vehicles.modal.brandPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehCondition"
            name="condition"
            :label="$t('objects.vehicles.modal.condition')"
        >
            <Select
                id="vehCondition"
                v-model="state.condition"
                :options="conditionOptions"
                option-label="label"
                option-value="value"
                :placeholder="
                    $t('objects.vehicles.modal.conditionPlaceholder')
                "
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="vehModel"
            name="model"
            :label="$t('objects.vehicles.modal.model')"
        >
            <InputText
                id="vehModel"
                v-model="state.model"
                :placeholder="$t('objects.vehicles.modal.modelPlaceholder')"
                fluid
            />
        </SharedAppFormField>
    </div>
</template>

<script setup lang="ts">
import type { VehicleType } from '~/types/vehicle';
import { useVehicleFormContext } from '~/composables/useVehicleForm';
import { VEHICLE_TYPE_ICONS } from '~/constants/vehicles';

const { state, r$, companies, typeOptions, fuelOptions, conditionOptions } =
    useVehicleFormContext();

/** Resolves the localized label for a selected type value */
const typeLabelOf = (value: VehicleType): string =>
    typeOptions.value.find((o) => o.value === value)?.label ?? value;
</script>
