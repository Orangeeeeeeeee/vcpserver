<template>
    <VehicleDetailPageShell :vehicle="vehicle">
        <div class="h-full grow flex flex-col">
            <SharedPanelMapLayout
                v-model:view="view"
                class="h-[calc(100dvh-230px)] min-h-[28rem] md:h-[calc(100dvh-210px)]"
                panel-class="-m-4"
                map-class="-m-4 lg:ml-0 lg:-mt-5 lg:-mr-6 lg:-mb-5"
            >
                <template #panel>
                    <VehicleOnlinePanel @show-map="view = 'map'" />
                </template>

                <template #map>
                    <div class="relative flex h-full flex-col">
                        <div class="relative min-h-0 flex-1">
                            <VehicleOnlineMap
                                v-if="hasToken"
                                @show-panel="view = 'panel'"
                            />
                            <SharedTableEmpty
                                v-else
                                icon="tabler:map-pin"
                                :message="$t('objects.online.noToken')"
                            />
                        </div>

                        <!-- md+: camera chips bar under the map -->
                        <VehicleVideoDock
                            v-if="videoOpen"
                            class="hidden bg-surface-100 px-4 py-3 md:flex"
                            :cameras="detail.cameras"
                            :active-camera-ids="activeCameraIds"
                            :fullscreen-target-id="VEHICLE_MAP_WRAPPER_ID"
                            @toggle-camera="toggleCamera"
                            @close="videoOpen = false"
                        />

                        <!-- Mobile: the video screen replaces the map -->
                        <div
                            v-if="videoOpen"
                            class="absolute inset-0 z-[1001] flex flex-col gap-3 bg-surface-100 p-4 md:hidden"
                        >
                            <VehicleVideoDock
                                :cameras="detail.cameras"
                                :active-camera-ids="activeCameraIds"
                                @toggle-camera="toggleCamera"
                                @close="videoOpen = false"
                            />
                            <UiScrollPanel class="min-h-0 flex-1">
                                <div class="flex flex-col gap-3">
                                    <VehicleCameraPlayer
                                        v-for="camera in activeCameras"
                                        :key="camera.id"
                                        :camera="camera"
                                    />
                                </div>
                            </UiScrollPanel>
                        </div>
                    </div>
                </template>
            </SharedPanelMapLayout>
        </div>
    </VehicleDetailPageShell>
</template>

<script setup lang="ts">
import type { PanelMapLayoutView } from '~/components/shared/PanelMapLayout';
import {
    useVehicleOnline,
    useOnlineVehicleFromRoute,
    VEHICLE_ONLINE_KEY,
    VEHICLE_MAP_WRAPPER_ID
} from '~/composables/useVehicleOnline';

const { vehicle } = useOnlineVehicleFromRoute();

/** Shared page state (detail data, video dock, map), provided to panel/map */
const context = useVehicleOnline(vehicle);
provide(VEHICLE_ONLINE_KEY, context);
const { detail, videoOpen, activeCameraIds, activeCameras, toggleCamera } =
    context;

/** Panel visibility switch below lg; the details show by default */
const view = ref<PanelMapLayoutView>('panel');

/** Map renders only when the Mapbox token is configured */
const hasToken = computed<boolean>(() =>
    Boolean(useRuntimeConfig().public.mapboxToken)
);
</script>
