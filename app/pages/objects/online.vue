<template>
    <div class="h-full grow flex flex-col">
        <SharedPanelMapLayout
            v-model:view="view"
            class="h-[calc(100dvh-230px)] min-h-[28rem] md:h-[calc(100dvh-210px)]"
            panel-class="-m-4"
            map-class="-m-4 lg:ml-0 lg:-mt-5 lg:-mr-6 lg:-mb-5"
        >
            <template #panel>
                <OnlinePanel>
                    <template #actions>
                        <UiMapAction
                            class="lg:hidden"
                            icon="tabler:map"
                            :aria-label="$t('objects.online.mapView')"
                            @click="view = 'map'"
                        />
                    </template>
                </OnlinePanel>
            </template>

            <template #map>
                <ObjectsOnlineMap v-if="hasToken" @show-list="view = 'panel'" />
                <SharedEmpty
                    v-else
                    icon="tabler:map-pin"
                    :message="$t('objects.online.noToken')"
                />
            </template>
        </SharedPanelMapLayout>

        <SharedClientTeleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:bus', to: ROUTES.OBJECTS_ONLINE },
                    { label: $t('objects.tabs.online') }
                ]"
            />
        </SharedClientTeleport>
    </div>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';
import { useOnlineFleet, ONLINE_FLEET_KEY } from '~/composables/useOnlineFleet';
import type { PanelMapLayoutView } from '~/components/shared/PanelMapLayout';

/** Shared fleet state, provided to the panel and the map */
const fleet = useOnlineFleet();
provide(ONLINE_FLEET_KEY, fleet);

/** Panel visibility switch below lg; the map shows by default */
const view = ref<PanelMapLayoutView>('map');

/** Focusing a vehicle from the panel reveals the map below lg */
watch(fleet.focusRequest, (request) => {
    if (request) view.value = 'map';
});

/** Map renders only when the Mapbox token is configured */
const hasToken = computed<boolean>(() =>
    Boolean(useRuntimeConfig().public.mapboxToken)
);
</script>
