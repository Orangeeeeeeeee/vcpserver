<template>
    <div class="h-full grow flex flex-col">
        <SharedPanelMapLayout
            v-model:view="view"
            class="h-[calc(100dvh-230px)] min-h-[28rem] md:h-[calc(100dvh-210px)]"
            panel-class="-m-4"
            map-class="-m-4 lg:ml-0 lg:-mt-5 lg:-mr-6 lg:-mb-5"
        >
            <template #panel>
                <ZonesZoneDetailPanel @show-map="view = 'map'" />
            </template>

            <template #map>
                <ZonesZoneDetailMap
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

        <SharedClientTeleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:border-radius', to: ROUTES.ZONES },
                    { label: zone.name }
                ]"
            />
        </SharedClientTeleport>

        <!-- «Редагувати» in the page header (icon-only below lg) -->
        <SharedClientTeleport to="#page-actions-header">
            <UiActionButton
                icon="tabler:pencil"
                :label="$t('zones.detail.edit')"
                @click="onEdit"
            />
        </SharedClientTeleport>
    </div>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';
import { useZoneStats, ZONE_DETAIL_KEY } from '~/composables/useZoneStats';
import type { PanelMapLayoutView } from '~/components/shared/PanelMapLayout';

definePageMeta({
    layout: 'default'
});

const route = useRoute();
const { zones } = useZones();

/** Zone being viewed, resolved from the route id */
const zone = zones.value.find((z) => z.id === route.params.id);
if (!zone) {
    throw createError({ statusCode: 404 });
}

/** Shared zone detail state (zone, date, stats) for the panel and the map */
const detail = useZoneStats(zone);
provide(ZONE_DETAIL_KEY, detail);

/** Panel visibility switch below lg; the details show by default */
const view = ref<PanelMapLayoutView>('panel');

/** Map renders only when the Mapbox token is configured */
const hasToken = computed<boolean>(() =>
    Boolean(useRuntimeConfig().public.mapboxToken)
);

/** Navigates to the zone edit page */
const onEdit = (): void => {
    navigateTo(ROUTES.ZONE_EDIT(zone.id));
};
</script>
