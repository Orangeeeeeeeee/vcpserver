<template>
    <div class="h-full grow flex flex-col">
        <SharedPanelMapLayout
            v-model:view="view"
            class="h-[calc(100dvh-230px)] min-h-[28rem] md:h-[calc(100dvh-210px)]"
            panel-class="-m-4"
            map-class="-m-4 lg:ml-0 lg:-mt-5 lg:-mr-6 lg:-mb-5"
        >
            <template #panel>
                <RoutesRouteFormPanel
                    @show-map="view = 'map'"
                    @cancel="onCancel"
                    @saved="onSaved"
                />
            </template>

            <template #map>
                <RoutesFormMap v-if="hasToken" @show-panel="view = 'panel'" />
                <SharedTableEmpty
                    v-else
                    icon="tabler:map-pin"
                    :message="$t('objects.online.noToken')"
                />
            </template>
        </SharedPanelMapLayout>

        <SharedClientTeleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    {
                        icon: 'tabler:route',
                        label: $t('routes.breadcrumbRegular'),
                        to: ROUTES.ROUTES_PAGE
                    },
                    { label: $t('routes.create.title') }
                ]"
            />
        </SharedClientTeleport>
    </div>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';
import { useRouteForm, ROUTE_FORM_KEY } from '~/composables/useRouteForm';
import type { PanelMapLayoutView } from '~/components/shared/PanelMapLayout';
import type { Route } from '~/types/route';

definePageMeta({
    layout: 'default'
});

const { t } = useI18n();
const toast = useToast();

/** Shared route form state, provided to the panel and the map */
const form = useRouteForm();
provide(ROUTE_FORM_KEY, form);

/** Panel visibility switch below lg; the form shows by default */
const view = ref<PanelMapLayoutView>('panel');

/** Map renders only when the Mapbox token is configured */
const hasToken = computed<boolean>(() =>
    Boolean(useRuntimeConfig().public.mapboxToken)
);

/** «Скасувати» returns to the routes list without saving */
const onCancel = (): void => {
    void navigateTo(ROUTES.ROUTES_PAGE);
};

/**
 * Successful submit: notifies the user and returns to the routes list.
 * @param {Route} route Newly created route.
 */
const onSaved = (route: Route): void => {
    toast.add({
        severity: 'success',
        summary: t('routes.create.created'),
        detail: route.name,
        life: 2000
    });
    void navigateTo(ROUTES.ROUTES_PAGE);
};
</script>
