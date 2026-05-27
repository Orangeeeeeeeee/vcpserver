<template>
    <SharedPageLayout :title="$t('objects.title')" :tabs="tabs">
        <template #content>
            <NuxtPage />
        </template>
    </SharedPageLayout>
</template>

<script setup lang="ts">
import type { PageLayoutTab } from '~/components/shared/PageLayout';
import { ROUTES } from '~/constants/routes';

interface ObjectsTabConfig {
    /** i18n suffix under `objects.tabs.*` */
    key: string;
    /** Target route path */
    to: string;
}

const { t } = useI18n();

/** Objects section tab configuration */
const tabsConfig: ObjectsTabConfig[] = [
    { key: 'online', to: ROUTES.OBJECTS_ONLINE },
    { key: 'trackers', to: ROUTES.OBJECTS_TRACKERS },
    { key: 'drivers', to: ROUTES.OBJECTS_DRIVERS },
    { key: 'vehicles', to: ROUTES.OBJECTS_VEHICLES },
    { key: 'groups', to: ROUTES.OBJECTS_GROUPS }
];

const tabs = computed<PageLayoutTab[]>(() =>
    tabsConfig.map((tab) => ({
        label: t(`objects.tabs.${tab.key}`),
        to: tab.to
    }))
);
</script>
