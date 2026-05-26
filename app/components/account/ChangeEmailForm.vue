<template>
    <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <SharedAppFormField
            id="changeEmailPassword"
            name="password"
            :label="$t('common.password')"
            :error="r$.$fields.password.$errors[0]"
        >
            <Password
                id="changeEmailPassword"
                v-model="state.password"
                :feedback="false"
                toggle-mask
                :placeholder="$t('account.info.passwordPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="changeEmailNew"
            name="newEmail"
            :label="$t('account.info.newEmail')"
            :error="r$.$fields.newEmail.$errors[0]"
        >
            <InputText
                id="changeEmailNew"
                v-model="state.newEmail"
                type="email"
                :placeholder="$t('account.info.newEmailPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <div>
            <Button
                type="submit"
                class="w-full md:w-auto"
                :label="$t('account.info.changeEmail')"
                :disabled="isSubmitDisabled"
            />
        </div>
    </form>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import { useToast } from 'primevue/usetoast';

interface ChangeEmailFormState {
    password: string;
    newEmail: string;
}

const { t } = useI18n();
const toast = useToast();
const { profile } = useAccountProfile();

const state = reactive<ChangeEmailFormState>({
    password: '',
    newEmail: profile.value.email
});

const { r$ } = useRegle(
    state,
    {
        password: { required: withMessage(required, 'validation.required') },
        newEmail: {
            required: withMessage(required, 'validation.required'),
            ...emailRules()
        }
    },
    { lazy: true }
);

/** Whether the submit button should be disabled */
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Validates, updates the stored email, and shows a success toast */
const onSubmit = async (): Promise<void> => {
    const result = await r$.$validate();
    if (result) {
        profile.value = { ...profile.value, email: state.newEmail };
        toast.add({
            severity: 'success',
            summary: t('account.info.emailChanged'),
            life: 3000
        });
        state.password = '';
    }
};
</script>
