<template>
    <Form
        :resolver="resolver"
        class="flex flex-col gap-5"
        novalidate
        @submit="onSubmit"
    >
        <SharedAppFormField
            id="password"
            name="password"
            :label="$t('resetPassword.newPassword')"
        >
            <Password
                id="password"
                v-model="password"
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
        >
            <Password
                id="confirmPassword"
                v-model="confirmPassword"
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
    </Form>
</template>

<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { ROUTES } from '~/constants/routes';

const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const password = ref('');
const confirmPassword = ref('');
const isSubmitDisabled = computed(
    () => !password.value || !confirmPassword.value
);

const resolver = zodResolver(passwordWithConfirmSchema());

const onSubmit = (e: FormSubmitEvent) => {
    if (e.valid) {
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
