<template>
    <SharedAuthLayout
        v-if="!submitted"
        :title="$t('forgotPassword.title')"
        :subtitle="$t('forgotPassword.subtitle')"
    >
        <SharedForgotPasswordForm @submitted="onSubmitted" />
    </SharedAuthLayout>

    <SharedAuthLayout
        v-else
        :title="$t('forgotPassword.successTitle')"
        :subtitle="
            $t('forgotPassword.successSubtitle', { email: submittedEmail })
        "
    >
        <div class="flex flex-col gap-4 items-center">
            <Button
                :label="$t('common.ok')"
                severity="secondary"
                class="w-full"
                as="router-link"
                :to="ROUTES.OBJECTS"
            />
            <p class="text-sm text-[var(--p-surface-700)]">
                {{ $t('forgotPassword.noEmail') }}
                <button
                    class="text-[var(--p-primary-600)] font-medium cursor-pointer"
                    @click="onResend"
                >
                    {{ $t('forgotPassword.resend') }}
                </button>
            </p>
        </div>
    </SharedAuthLayout>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';

definePageMeta({
    layout: 'blank'
});

const submitted = ref(false);
const submittedEmail = ref('');

/** Handles successful form submission */
const onSubmitted = (email: string): void => {
    submittedEmail.value = email;
    submitted.value = true;
};

/** Resends the password reset email */
const onResend = (): void => {
    console.log('Resend to:', submittedEmail.value);
};
</script>
