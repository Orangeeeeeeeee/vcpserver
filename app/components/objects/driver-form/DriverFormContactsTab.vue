<template>
    <div class="flex flex-col gap-5">
        <SharedAppFormField
            id="drvPhone"
            name="phone"
            :label="$t('objects.drivers.modal.phone')"
            :error="r$.$fields.phone.$errors"
        >
            <InputText
                id="drvPhone"
                v-model="state.phone"
                :placeholder="$t('objects.drivers.modal.phonePlaceholder')"
                :invalid="r$.$fields.phone.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="drvEmail"
            name="email"
            :label="$t('objects.drivers.modal.email')"
            :error="r$.$fields.email.$errors"
        >
            <InputText
                id="drvEmail"
                v-model="state.email"
                type="email"
                :placeholder="$t('objects.drivers.modal.emailPlaceholder')"
                :invalid="r$.$fields.email.$invalid"
                fluid
            />
        </SharedAppFormField>
    </div>
</template>

<script setup lang="ts">
import { useDriverFormContext } from '~/composables/useDriverForm';

const { state, r$ } = useDriverFormContext();
</script>
