<template>
    <div class="h-full grow flex flex-col">
        <div
            class="relative flex h-[calc(100dvh-230px)] min-h-[28rem] gap-6 md:h-[calc(100dvh-210px)] h-full grow"
        >
            <!-- Fleet panel: overlay over the map on mobile/tablet, column on lg+ -->
            <div
                class="absolute inset-0 -m-4 z-[1100] overflow-hidden bg-surface-100 shadow-xl md:right-auto md:w-[23.375rem] lg:static lg:inset-auto lg:m-0 lg:w-[26.125rem] lg:shrink-0 lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none"
                :class="mobileView === 'list' ? 'block' : 'hidden lg:block'"
            >
                <OnlinePanel>
                    <template #actions>
                        <UiMapAction
                            class="lg:hidden"
                            icon="tabler:map"
                            :aria-label="$t('objects.online.mapView')"
                            @click="mobileView = 'map'"
                        />
                    </template>
                </OnlinePanel>
            </div>

            <!-- Map: always full width below lg, a column on lg+ -->
            <div
                class="relative min-w-0 flex-1 overflow-hidden -m-4 lg:ml-0 lg:-mt-5 lg:-mr-6 lg:-mb-5"
            >
                <ObjectsOnlineMap
                    v-if="hasToken"
                    @show-list="mobileView = 'list'"
                />
                <SharedTableEmpty
                    v-else
                    icon="tabler:map-pin"
                    :message="$t('objects.online.noToken')"
                />
            </div>
        </div>

        <Teleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:bus', to: ROUTES.OBJECTS_ONLINE },
                    { label: $t('objects.tabs.online') }
                ]"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';
import { useOnlineFleet, ONLINE_FLEET_KEY } from '~/composables/useOnlineFleet';

/** Shared fleet state, provided to the panel and the map */
const fleet = useOnlineFleet();
provide(ONLINE_FLEET_KEY, fleet);

/**
 * Panel visibility switch below lg; the map shows by default and the panel
 * opens as an overlay over it. On lg+ the panel and the map are shown side by
 * side as columns and this switch has no effect.
 */
const mobileView = ref<'list' | 'map'>('map');

/** Map renders only when the Mapbox token is configured */
const hasToken = computed<boolean>(() =>
    Boolean(useRuntimeConfig().public.mapboxToken)
);
</script>
