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
                @click="navigateToLogin"
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

const router = useRouter();
const submitted = ref(false);
const submittedEmail = ref('');

const onSubmitted = (email: string) => {
    submittedEmail.value = email;
    submitted.value = true;
};

const navigateToLogin = () => {
    router.push(ROUTES.LOGIN);
};

const onResend = () => {
    console.log('Resend to:', submittedEmail.value);
};
</script>
