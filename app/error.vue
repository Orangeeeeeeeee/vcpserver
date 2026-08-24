<template>
    <div class="flex flex-col min-h-dvh">
        <div
            class="flex flex-1 flex-col lg:flex-row items-center justify-center px-4 md:px-8 gap-8 md:gap-16 lg:gap-20 lg:max-w-[1300px] lg:m-auto"
        >
            <div
                class="flex flex-col items-center lg:items-start text-center lg:text-left order-2 md:order-1 md:max-w-[460px] lg:max-w-max"
            >
                <p
                    class="text-xs md:text-sm lg:text-base mb-2 lg:mb-4 font-semibold text-primary-600 mb-3"
                >
                    {{ errorData.label }}
                </p>
                <UiTypography
                    variant="h1"
                    class="mb-2 lg:mb-4 text-primary-950"
                >
                    {{ errorData.title }}
                </UiTypography>
                <p
                    class="text-xs md:text-sm lg:text-base text-surface-500 mb-8 md:mb-11"
                >
                    {{ errorData.description }}
                </p>
                <div class="flex gap-3 w-full">
                    <Button
                        size="small"
                        severity="secondary"
                        :label="$t('common.back')"
                        class="grow shrink-0 lg:grow-0"
                        @click="goBack"
                    >
                        <template #icon>
                            <Icon name="tabler:arrow-left" />
                        </template>
                    </Button>
                    <Button
                        v-if="error.statusCode === 401"
                        :label="$t('common.login')"
                        size="small"
                        class="grow shrink-0 lg:grow-0"
                        @click="navigateTo(ROUTES.LOGIN)"
                    />
                    <Button
                        v-else
                        size="small"
                        class="grow shrink-0 lg:grow-0"
                        :label="$t('common.home')"
                        @click="handleError"
                    />
                </div>
            </div>

            <div
                class="order-[-1] lg:order-2 w-full max-w-[81.634%] md:max-w-[56.82%] h-auto flex items-center justify-center"
            >
                <img
                    :src="errorImage"
                    :alt="errorData.label"
                    class="w-full h-auto"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import { ROUTES } from '~/constants/routes';
import { useTheme } from '~/composables/useTheme';

useTheme();
import img401 from '~/assets/images/401.svg';
import img403 from '~/assets/images/403.svg';
import img404 from '~/assets/images/404.svg';
import img500 from '~/assets/images/500.svg';
import img503 from '~/assets/images/503.svg';

const errorImages: Record<string, string> = {
    '401': img401,
    '403': img403,
    '404': img404,
    '500': img500,
    '503': img503
};

const props = defineProps<{ error: NuxtError }>();
const { t } = useI18n();
const router = useRouter();

const supportedCodes = ['401', '403', '404', '500', '503'];
const code = computed(() => {
    const c = String(props.error.statusCode);
    return supportedCodes.includes(c) ? c : '404';
});

const errorImage = computed(() => errorImages[code.value]);

const errorData = computed(() => ({
    label: t(`errors.${code.value}.label`),
    title: t(`errors.${code.value}.title`),
    description: t(`errors.${code.value}.description`)
}));

const goBack = () => {
    router.back();
};

const handleError = () => {
    clearError({ redirect: ROUTES.OBJECTS });
};
</script>
