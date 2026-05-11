<template>
    <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <SharedAppFormField
            id="email"
            name="email"
            :label="$t('common.email')"
            :error="r$.$fields.email.$errors[0]"
        >
            <InputText
                id="email"
                v-model="state.email"
                type="email"
                :placeholder="$t('common.emailPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <div class="flex gap-3">
            <Button
                type="button"
                :label="$t('common.back')"
                severity="secondary"
                class="flex-1"
                @click="navigateBack"
            />
            <Button
                type="submit"
                :label="$t('forgotPassword.submit')"
                class="flex-1"
                :disabled="isSubmitDisabled"
            />
        </div>
    </form>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import { ROUTES } from '~/constants/routes';

interface ForgotPasswordFormState {
    email: string;
}

interface ForgotPasswordFormEmits {
    (e: 'submitted', email: string): void;
}

const state = reactive<ForgotPasswordFormState>({
    email: ''
});
const router = useRouter();

const { r$ } = useRegle(
    state,
    {
        email: {
            required: withMessage(required, 'validation.required'),
            ...emailRules()
        }
    },
    { lazy: true }
);

/** Whether the submit button should be disabled */
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Navigates back to the login page */
const navigateBack = (): void => {
    router.push(ROUTES.LOGIN);
};

const emit = defineEmits<ForgotPasswordFormEmits>();

/** Validates and emits the submitted email */
const onSubmit = async (): Promise<void> => {
    const result = await r$.$validate();
    if (result) {
        emit('submitted', state.email);
    }
};
</script>
