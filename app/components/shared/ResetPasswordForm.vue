<template>
    <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <SharedAppFormField
            id="password"
            name="password"
            :label="$t('resetPassword.newPassword')"
            :error="r$.$fields.password.$errors[0]"
        >
            <Password
                id="password"
                v-model="state.password"
                :feedback="false"
                toggle-mask
                :placeholder="$t('resetPassword.newPasswordPlaceholder')"
                :invalid="r$.$fields.password.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="confirmPassword"
            name="confirmPassword"
            :label="$t('resetPassword.confirmPassword')"
            :error="r$.$fields.confirmPassword.$errors[0]"
        >
            <Password
                id="confirmPassword"
                v-model="state.confirmPassword"
                :feedback="false"
                toggle-mask
                :placeholder="$t('resetPassword.confirmPasswordPlaceholder')"
                :invalid="r$.$fields.confirmPassword.$invalid"
                fluid
            />
        </SharedAppFormField>

        <Button
            type="submit"
            size="small"
            :label="$t('resetPassword.submit')"
            :disabled="isSubmitDisabled"
        />
    </form>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core';
import { withMessage, required, sameAs } from '@regle/rules';
import { useToast } from 'primevue/usetoast';
import { ROUTES } from '~/constants/routes';

interface ResetPasswordFormState {
    password: string;
    confirmPassword: string;
}

const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const state = reactive<ResetPasswordFormState>({
    password: '',
    confirmPassword: ''
});
const { r$ } = useRegle(
    state,
    {
        password: {
            required: withMessage(required, 'validation.required'),
            ...passwordRules()
        },
        confirmPassword: {
            required: withMessage(required, 'validation.required'),
            ...passwordRules(),
            sameAs: withMessage(
                sameAs(() => state.password),
                'validation.confirmPassword'
            )
        }
    },
    { lazy: true }
);

/** Whether the submit button should be disabled */
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Validates form, shows success toast, and redirects to home */
const onSubmit = async (): Promise<void> => {
    const { valid } = await r$.$validate();
    if (valid) {
        toast.add({
            severity: 'success',
            summary: t('resetPassword.successTitle'),
            detail: t('resetPassword.successDetail'),
            life: 3000
        });
        router.push(ROUTES.OBJECTS);
    }
};
</script>
