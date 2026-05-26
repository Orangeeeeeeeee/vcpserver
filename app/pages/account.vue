<template>
    <SharedPageLayout :title="$t('account.title')" :tabs="tabs">
        <template #content>
            <NuxtPage />
        </template>
    </SharedPageLayout>
</template>

<script setup lang="ts">
import type { PageLayoutTab } from '~/components/shared/PageLayout';
import { ROUTES } from '~/constants/routes';

const { t } = useI18n();

/** Account section navigation tabs */
const tabs = computed<PageLayoutTab[]>(() => [
    { label: t('account.tabs.info'), to: ROUTES.ACCOUNT_INFO },
    { label: t('account.tabs.settings'), to: ROUTES.ACCOUNT_SETTINGS }
]);
</script>
