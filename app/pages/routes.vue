<template>
    <SharedPageLayout :title="title" :tabs="tabs">
        <template #content>
            <NuxtPage />
        </template>
    </SharedPageLayout>
</template>

<script setup lang="ts">
import type { PageLayoutTab } from '~/components/shared/PageLayout';
import type { Route } from '~/types/route';
import { ROUTES } from '~/constants/routes';

const route = useRoute();
const { t } = useI18n();
const { routes } = useRoutes();

/** Route resolved from the /routes/[id] param; null off the detail page */
const viewedRoute = computed<Route | null>(() => {
    const id = route.params.id;
    return typeof id === 'string'
        ? (routes.value.find((r) => r.id === id) ?? null)
        : null;
});

/** «Новий маршрут» on the create page, the route name on the detail page,
 * the section title elsewhere */
const title = computed<string>(() => {
    if (viewedRoute.value) return viewedRoute.value.name;
    return route.path === ROUTES.ROUTES_NEW
        ? t('routes.create.title')
        : t('routes.title');
});

/**
 * Routes section tabs (2 list pages + 4 links whose pages are not
 * implemented yet). Hidden on the create page — it has no tab of its own.
 * The detail page swaps in its own tab set (route + trip links).
 */
const tabs = computed<PageLayoutTab[] | undefined>(() => {
    if (route.path === ROUTES.ROUTES_NEW) return undefined;
    if (viewedRoute.value) {
        return [
            {
                label: t('routes.detail.tabs.route'),
                to: ROUTES.ROUTE_DETAIL(viewedRoute.value.id)
            },
            {
                label: t('routes.tabs.activeTrips'),
                to: ROUTES.ROUTES_TRIPS_ACTIVE,
                trailingIcon: 'tabler:arrow-up-right'
            },
            {
                label: t('routes.tabs.archiveTrips'),
                to: ROUTES.ROUTES_TRIPS_ARCHIVE,
                trailingIcon: 'tabler:arrow-up-right'
            }
        ];
    }
    return [
        { label: t('routes.tabs.regular'), to: ROUTES.ROUTES_PAGE },
        {
            label: t('routes.tabs.scheduled'),
            to: ROUTES.ROUTES_SCHEDULED
        },
        {
            label: t('routes.tabs.groups'),
            to: ROUTES.ROUTES_GROUPS,
            trailingIcon: 'tabler:arrow-up-right'
        },
        {
            label: t('routes.tabs.activeTrips'),
            to: ROUTES.ROUTES_TRIPS_ACTIVE,
            trailingIcon: 'tabler:arrow-up-right'
        },
        {
            label: t('routes.tabs.archiveTrips'),
            to: ROUTES.ROUTES_TRIPS_ARCHIVE,
            trailingIcon: 'tabler:arrow-up-right'
        },
        {
            label: t('routes.tabs.cancelledTrips'),
            to: ROUTES.ROUTES_TRIPS_CANCELLED,
            trailingIcon: 'tabler:arrow-up-right'
        }
    ];
});
</script>
