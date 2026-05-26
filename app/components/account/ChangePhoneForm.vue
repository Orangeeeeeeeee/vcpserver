<template>
    <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <SharedAppFormField
            id="changePhonePassword"
            name="password"
            :label="$t('common.password')"
            :error="r$.$fields.password.$errors[0]"
        >
            <Password
                id="changePhonePassword"
                v-model="state.password"
                :feedback="false"
                toggle-mask
                :placeholder="$t('account.info.passwordPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="changePhoneNew"
            name="newPhone"
            :label="$t('account.info.newPhone')"
            :error="r$.$fields.newPhone.$errors[0]"
        >
            <InputText
                id="changePhoneNew"
                v-model="state.newPhone"
                :placeholder="$t('account.info.newPhonePlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <div>
            <Button
                type="submit"
                class="w-full md:w-auto"
                :label="$t('account.info.changePhone')"
                :disabled="isSubmitDisabled"
            />
        </div>
    </form>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import { useToast } from 'primevue/usetoast';

interface ChangePhoneFormState {
    password: string;
    newPhone: string;
}

const { t } = useI18n();
const toast = useToast();
const { profile } = useAccountProfile();

const state = reactive<ChangePhoneFormState>({
    password: '',
    newPhone: ''
});

const { r$ } = useRegle(
    state,
    {
        password: { required: withMessage(required, 'validation.required') },
        newPhone: { required: withMessage(required, 'validation.required') }
    },
    { lazy: true }
);

/** Whether the submit button should be disabled */
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Validates, updates the stored phone, and shows a success toast */
const onSubmit = async (): Promise<void> => {
    const result = await r$.$validate();
    if (result) {
        profile.value = { ...profile.value, phone: state.newPhone };
        toast.add({
            severity: 'success',
            summary: t('account.info.phoneChanged'),
            life: 3000
        });
        state.password = '';
        state.newPhone = '';
    }
};
</script>
