<template>
    <div class="h-full grow flex flex-col">
        <SharedPanelMapLayout
            v-model:view="view"
            class="h-[calc(100dvh-230px)] min-h-[28rem] md:h-[calc(100dvh-210px)]"
            panel-class="-m-4"
            map-class="-m-4 lg:ml-0 lg:-mt-5 lg:-mr-6 lg:-mb-5"
        >
            <template #panel>
                <RoutesRouteViewPanel @show-map="view = 'map'" />
            </template>

            <template #map>
                <RoutesRouteViewMap
                    v-if="hasToken"
                    @show-panel="view = 'panel'"
                />
                <SharedTableEmpty
                    v-else
                    icon="tabler:map-pin"
                    :message="$t('objects.online.noToken')"
                />
            </template>
        </SharedPanelMapLayout>

        <Teleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:route', to: listPath },
                    { label: listLabel, to: listPath },
                    { label: viewedRoute.name }
                ]"
            />
        </Teleport>

        <Teleport :to="actionsTarget">
            <Button
                severity="secondary"
                outlined
                :aria-label="$t('common.edit')"
                @click="editVisible = true"
            >
                <template #icon>
                    <Icon name="tabler:pencil" class="size-5" />
                </template>
            </Button>
            <Button
                severity="danger"
                outlined
                :aria-label="$t('common.delete')"
                @click="deleteVisible = true"
            >
                <template #icon>
                    <Icon name="tabler:trash" class="size-5" />
                </template>
            </Button>
        </Teleport>

        <RoutesRouteEditDialog
            v-model:visible="editVisible"
            :route="viewedRoute"
        />

        <SharedConfirmDeleteDialog
            v-model:visible="deleteVisible"
            group="confirmDeleteRouteDetail"
            :title="$t('routes.list.modal.deleteTitle')"
            :message="$t('routes.list.modal.deleteSubtitle')"
            :item-name="viewedRoute.name"
            :warning="$t('common.deleteWarning')"
            @confirm="onConfirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { ROUTES } from '~/constants/routes';
import {
    useRouteView,
    useRouteDetailFromRoute,
    ROUTE_VIEW_KEY
} from '~/composables/useRouteView';
import type { PanelMapLayoutView } from '~/components/shared/PanelMapLayout';

definePageMeta({
    layout: 'default'
});

const { t } = useI18n();
const toast = useToast();
const { deleteRoute } = useRoutes();

const { route: viewedRoute } = useRouteDetailFromRoute();

/** Shared page state (route + map settings), provided to the panel and map */
const context = useRouteView(viewedRoute);
provide(ROUTE_VIEW_KEY, context);

/** Panel visibility switch below lg; the route info shows by default */
const view = ref<PanelMapLayoutView>('panel');

/** Map renders only when the Mapbox token is configured */
const hasToken = computed<boolean>(() =>
    Boolean(useRuntimeConfig().public.mapboxToken)
);

const isTablet = useMediaQuery('(min-width: 768px)');
/** PageLayout slot for the edit/delete actions — mobile sits next to title */
const actionsTarget = computed((): string =>
    isTablet.value ? '#page-actions-target' : '#page-actions-header'
);

/** List page this route belongs to (breadcrumbs + after-delete return) */
const listPath = computed<string>(() =>
    viewedRoute.value.scheduled ? ROUTES.ROUTES_SCHEDULED : ROUTES.ROUTES_PAGE
);

/** Breadcrumb label of the owning list */
const listLabel = computed<string>(() =>
    t(
        viewedRoute.value.scheduled
            ? 'routes.breadcrumbScheduled'
            : 'routes.breadcrumbRegular'
    )
);

const editVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);

/** Deletes the route and returns to its list once confirmed */
const onConfirmDelete = async (): Promise<void> => {
    const removed = viewedRoute.value;
    toast.add({
        severity: 'success',
        summary: t('routes.list.deleted'),
        detail: removed.name,
        life: 2000
    });
    // navigate first: removing the record would break the page's render
    await navigateTo(
        removed.scheduled ? ROUTES.ROUTES_SCHEDULED : ROUTES.ROUTES_PAGE
    );
    deleteRoute(removed.id);
};
</script>
