<template>
    <div
        class="flex flex-col justify-center items-stretch w-full max-w-[360px] flex-1 mx-auto"
    >
        <div>
            <div
                class="text-center flex flex-col items-center mb-4 sm:mb-6 md:mb-8"
            >
                <Avatar
                    :label="userInitials"
                    size="large"
                    shape="circle"
                    class="mb-5"
                />
                <UiTypography
                    variant="h4"
                    class="mb-1 lg:mb-2 text-surface-950"
                >
                    {{ userName }}
                </UiTypography>
                <p
                    class="text-xs md:text-sm lg:text-base text-surface-800 mb-4"
                >
                    {{ userEmail }}
                </p>
                <p
                    class="text-xs md:text-sm lg:text-base text-surface-800 max-w-[80%] md:max-w-[95%]"
                >
                    {{ $t('resetPassword.subtitle') }}
                </p>
            </div>
            <SharedResetPasswordForm />
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'blank'
});

// TODO: fetch from API/token
const userName = 'Olivia Rhye';
const userEmail = 'olivia.rhye@untitledui.com';

/** User initials derived from the full name */
const userInitials = computed((): string =>
    userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
);
</script>
