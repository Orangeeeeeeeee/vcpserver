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
                :invalid="r$.$fields.email.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="password"
            name="password"
            :label="$t('common.password')"
            :error="r$.$fields.password.$errors[0]"
        >
            <Password
                id="password"
                v-model="state.password"
                :feedback="false"
                toggle-mask
                placeholder="•••••••"
                :invalid="r$.$fields.password.$invalid"
                fluid
            />
        </SharedAppFormField>

        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Checkbox v-model="rememberMe" input-id="rememberMe" binary />
                <label
                    for="rememberMe"
                    class="cursor-pointer text-xs md:text-sm text-surface-700"
                >
                    {{ $t('login.rememberMe') }}
                </label>
            </div>
            <NuxtLink
                :to="ROUTES.FORGOT_PASSWORD"
                class="text-xs md:text-sm font-normal text-primary-600"
            >
                {{ $t('login.forgotPassword') }}
            </NuxtLink>
        </div>

        <Button
            type="submit"
            size="small"
            :label="$t('login.submit')"
            :disabled="isSubmitDisabled"
        />
    </form>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import { ROUTES } from '~/constants/routes';

interface LoginFormState {
    email: string;
    password: string;
}

const state = reactive<LoginFormState>({
    email: '',
    password: ''
});
const rememberMe = ref(false);
const { r$ } = useRegle(
    state,
    {
        email: {
            required: withMessage(required, 'validation.required'),
            ...emailRules()
        },
        password: {
            required: withMessage(required, 'validation.required'),
            ...passwordRules()
        }
    },
    { lazy: true }
);

/** Whether the submit button should be disabled */
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Validates and submits the login form */
const onSubmit = async (): Promise<void> => {
    const { valid } = await r$.$validate();
    if (valid) {
        console.log('Login:', state);
    }
};
</script>
