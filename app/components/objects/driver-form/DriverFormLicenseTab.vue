<template>
    <div class="flex flex-col gap-5">
        <SharedAppFormField
            id="drvLicenseId"
            name="licenseId"
            :label="$t('objects.drivers.modal.licenseId')"
            :error="r$.$fields.licenseId.$errors"
        >
            <InputText
                id="drvLicenseId"
                v-model="state.licenseId"
                :placeholder="$t('objects.drivers.modal.licenseIdPlaceholder')"
                :invalid="r$.$fields.licenseId.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="drvLicenseExp"
            name="licenseExpiresAt"
            :label="$t('objects.drivers.modal.licenseExpiresAt')"
            :error="r$.$fields.licenseExpiresAt.$errors"
        >
            <DatePicker
                id="drvLicenseExp"
                v-model="state.licenseExpiresAt"
                date-format="dd.mm.yy"
                show-icon
                icon-display="input"
                :placeholder="
                    $t('objects.drivers.modal.licenseExpiresAtPlaceholder')
                "
                :invalid="r$.$fields.licenseExpiresAt.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="drvLicenseCat"
            name="licenseCategories"
            :label="$t('objects.drivers.modal.licenseCategories')"
            :error="r$.$fields.licenseCategories.$errors"
        >
            <UiMultiSelect
                id="drvLicenseCat"
                v-model="state.licenseCategories"
                :options="licenseCategoryOptions"
                display="chip"
                :placeholder="
                    $t('objects.drivers.modal.licenseCategoriesPlaceholder')
                "
                :invalid="r$.$fields.licenseCategories.$invalid"
                fluid
                show-select-all
            />
        </SharedAppFormField>
    </div>
</template>

<script setup lang="ts">
import { useDriverFormContext } from '~/composables/useDriverForm';

const { state, r$, licenseCategoryOptions } = useDriverFormContext();
</script>
