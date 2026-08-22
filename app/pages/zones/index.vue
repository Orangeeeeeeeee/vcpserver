<template>
    <div class="h-full grow flex flex-col">
        <SharedPanelMapLayout
            v-model:view="view"
            class="h-[calc(100dvh-230px)] min-h-[28rem] md:h-[calc(100dvh-210px)]"
            panel-class="-m-4"
            map-class="-m-4 lg:ml-0 lg:-mt-5 lg:-mr-6 lg:-mb-5"
        >
            <template #panel>
                <ZonesListPanel>
                    <template #actions>
                        <UiMapAction
                            class="lg:hidden"
                            icon="tabler:map"
                            :aria-label="$t('zones.list.mapView')"
                            @click="view = 'map'"
                        />
                    </template>
                </ZonesListPanel>
            </template>

            <template #map>
                <ZonesOverviewMap
                    v-if="hasToken"
                    @show-panel="view = 'panel'"
                />
                <SharedEmpty
                    v-else
                    icon="tabler:map-pin"
                    :message="$t('objects.online.noToken')"
                />
            </template>
        </SharedPanelMapLayout>

        <!-- Mobile: icon-only next to title; desktop: full button next to tabs -->
        <SharedClientTeleport to="#page-actions-header">
            <UiActionButton
                icon="tabler:plus"
                :label="$t('objects.add')"
                @click="onAdd"
            />
        </SharedClientTeleport>
    </div>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';
import {
    useZonesOverview,
    ZONES_OVERVIEW_KEY
} from '~/composables/useZonesOverview';
import type { PanelMapLayoutView } from '~/components/shared/PanelMapLayout';

definePageMeta({
    layout: 'default'
});

/** Shared zones overview state, provided to the panel and the map */
const overview = useZonesOverview();
provide(ZONES_OVERVIEW_KEY, overview);

/** Panel visibility switch below lg; the map shows by default */
const view = ref<PanelMapLayoutView>('map');

/** Map renders only when the Mapbox token is configured */
const hasToken = computed<boolean>(() =>
    Boolean(useRuntimeConfig().public.mapboxToken)
);

/** Navigates to the zone creation page */
const onAdd = (): void => {
    navigateTo(ROUTES.ZONES_NEW);
};
</script>
