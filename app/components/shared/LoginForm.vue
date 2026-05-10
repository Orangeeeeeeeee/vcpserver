<template>
    <Form :resolver="resolver" class="flex flex-col gap-5" novalidate @submit="onSubmit">
        <SharedAppFormField id="email" name="email" :label="$t('common.email')">
            <InputText
                id="email"
                v-model="email"
                type="email"
                :placeholder="$t('common.emailPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="password"
            name="password"
            :label="$t('common.password')"
        >
            <Password
                id="password"
                v-model="password"
                :feedback="false"
                toggle-mask
                placeholder="•••••••"
                fluid
            />
        </SharedAppFormField>

        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Checkbox v-model="rememberMe" input-id="rememberMe" binary />
                <label
                    for="rememberMe"
                    class="cursor-pointer text-xs md:text-sm text-[var(--p-surface-700)]"
                >
                    {{ $t('login.rememberMe') }}
                </label>
            </div>
            <NuxtLink
                :to="ROUTES.FORGOT_PASSWORD"
                class="text-xs md:text-sm font-normal text-[var(--p-primary-600)]"
            >
                {{ $t('login.forgotPassword') }}
            </NuxtLink>
        </div>

        <Button type="submit" :label="$t('login.submit')" :disabled="isSubmitDisabled" />
    </Form>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isSubmitDisabled = computed(() => !email.value || !password.value);

const resolver = zodResolver(
    z.object({
        email: emailSchema(),
        password: passwordSchema()
    })
);

const onSubmit = (e: FormSubmitEvent) => {
    if (e.valid) {
        console.log('Login:', e.values);
    }
};
</script>
