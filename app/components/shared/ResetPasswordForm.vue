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
                fluid
            />
        </SharedAppFormField>

        <Button
            type="submit"
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

const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const state = reactive({
    password: '',
    confirmPassword: ''
});
const isSubmitDisabled = computed(
    () => !state.password || !state.confirmPassword
);

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

const onSubmit = async () => {
    const result = await r$.$validate();
    if (result) {
        toast.add({
            severity: 'success',
            summary: t('resetPassword.successTitle'),
            detail: t('resetPassword.successDetail'),
            life: 3000
        });
        router.push(ROUTES.HOME);
    }
};
</script>
