<template>
    <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <SharedAppFormField
            id="oldPassword"
            name="oldPassword"
            :label="$t('account.info.oldPassword')"
            :error="r$.$fields.oldPassword.$errors[0]"
        >
            <Password
                id="oldPassword"
                v-model="state.oldPassword"
                :feedback="false"
                toggle-mask
                :placeholder="$t('account.info.oldPasswordPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="newPassword"
            name="newPassword"
            :label="$t('account.info.newPassword')"
            :error="r$.$fields.newPassword.$errors[0]"
        >
            <Password
                id="newPassword"
                v-model="state.newPassword"
                :feedback="false"
                toggle-mask
                :placeholder="$t('account.info.newPasswordPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="confirmNewPassword"
            name="confirmPassword"
            :label="$t('account.info.confirmNewPassword')"
            :error="r$.$fields.confirmPassword.$errors[0]"
        >
            <Password
                id="confirmNewPassword"
                v-model="state.confirmPassword"
                :feedback="false"
                toggle-mask
                :placeholder="$t('account.info.confirmNewPasswordPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <div>
            <Button
                type="submit"
                class="w-full md:w-auto"
                :label="$t('account.info.changePassword')"
                :disabled="isSubmitDisabled"
            />
        </div>
    </form>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core';
import { withMessage, required, sameAs } from '@regle/rules';
import { useToast } from 'primevue/usetoast';

interface ChangePasswordFormState {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const { t } = useI18n();
const toast = useToast();

const state = reactive<ChangePasswordFormState>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const { r$ } = useRegle(
    state,
    {
        oldPassword: { required: withMessage(required, 'validation.required') },
        newPassword: {
            required: withMessage(required, 'validation.required'),
            ...passwordRules()
        },
        confirmPassword: {
            required: withMessage(required, 'validation.required'),
            ...passwordRules(),
            sameAs: withMessage(
                sameAs(() => state.newPassword),
                'validation.confirmPassword'
            )
        }
    },
    { lazy: true }
);

/** Whether the submit button should be disabled */
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Validates the password change and shows a success toast */
const onSubmit = async (): Promise<void> => {
    const result = await r$.$validate();
    if (result) {
        toast.add({
            severity: 'success',
            summary: t('account.info.passwordChanged'),
            life: 3000
        });
        state.oldPassword = '';
        state.newPassword = '';
        state.confirmPassword = '';
    }
};
</script>
