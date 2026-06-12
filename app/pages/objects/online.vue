<template>
    <div>
        <div class="flex h-[calc(100dvh-230px)] min-h-[28rem] gap-4 md:h-[calc(100dvh-210px)]">
            <!-- Fleet panel -->
            <div
                class="w-full min-w-0 md:block md:w-[21rem] md:shrink-0 lg:w-[24rem]"
                :class="mobileView === 'list' ? 'block' : 'hidden'"
            >
                <OnlinePanel>
                    <template #actions>
                        <button
                            type="button"
                            class="online-map-btn md:hidden"
                            :aria-label="$t('objects.online.mapView')"
                            @click="mobileView = 'map'"
                        >
                            <Icon name="tabler:map" class="size-5" />
                        </button>
                    </template>
                </OnlinePanel>
            </div>

            <!-- Map -->
            <div
                class="relative min-w-0 flex-1 overflow-hidden rounded-lg border border-surface-300 md:block"
                :class="mobileView === 'map' ? 'block' : 'hidden'"
            >
                <ObjectsOnlineMap v-if="hasToken" />
                <SharedTableEmpty
                    v-else
                    icon="tabler:map-pin"
                    :message="$t('objects.online.noToken')"
                />

                <!-- Mobile: back to the list -->
                <button
                    v-if="hasToken"
                    type="button"
                    class="online-map-btn absolute left-14 top-3 md:hidden"
                    :aria-label="$t('objects.online.listView')"
                    @click="mobileView = 'list'"
                >
                    <Icon name="tabler:list" class="size-5" />
                </button>
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
import {
    useOnlineFleet,
    ONLINE_FLEET_KEY
} from '~/composables/useOnlineFleet';

/** Shared fleet state, provided to the panel and the map */
const fleet = useOnlineFleet();
provide(ONLINE_FLEET_KEY, fleet);

/** Mobile-only view switch; md+ shows the panel and the map side by side */
const mobileView = ref<'list' | 'map'>('list');

/** Map renders only when the Mapbox token is configured */
const hasToken = computed<boolean>(() =>
    Boolean(useRuntimeConfig().public.mapboxToken)
);
</script>
