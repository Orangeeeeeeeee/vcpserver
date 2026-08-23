<template>
    <VehicleDetailPageShell :vehicle="vehicle">
        <div class="h-full grow flex flex-col">
            <SharedPanelMapLayout
                v-model:view="view"
                class="h-[calc(100dvh-230px)] min-h-[28rem] md:h-[calc(100dvh-210px)]"
                panel-class="-m-4"
                map-class="-m-4 lg:ml-0 lg:-mt-5 lg:-mr-6 lg:-mb-0"
            >
                <template #panel>
                    <VehicleHistoryPanel @show-map="view = 'map'" />
                </template>

                <template #map>
                    <div class="relative flex h-full flex-col overflow-y-auto">
                        <div class="relative min-h-56 flex-1">
                            <VehicleHistoryMap
                                v-if="hasToken"
                                @show-panel="view = 'panel'"
                            />
                            <SharedEmpty
                                v-else
                                icon="tabler:map-pin"
                                :message="$t('objects.online.noToken')"
                            />
                        </div>

                        <!-- md+: camera chips bar under the map -->
                        <VehicleVideoDock
                            v-if="videoOpen"
                            class="hidden bg-surface-100 p-3 md:flex border border-surface-300 rounded-[10px] mt-3"
                            :cameras="cameras"
                            :active-camera-ids="activeCameraIds"
                            :fullscreen-target-id="HISTORY_MAP_WRAPPER_ID"
                            @toggle-camera="toggleCamera"
                            @close="videoOpen = false"
                        />

                        <!-- Telemetry panel, or the slim timeline bar -->
                        <VehicleTelemetryPanel
                            v-if="telemetryOpen"
                            class="mt-3 ml-4 mr-4 shrink-0 lg:ml-0"
                        />
                        <div
                            v-else
                            class="mt-3 shrink-0 rounded-[10px] border border-surface-300 px-4 pb-2 pt-3"
                        >
                            <VehicleHistoryTimeline />
                        </div>

                        <!-- Mobile: the video screen replaces the map -->
                        <div
                            v-if="videoOpen"
                            class="absolute inset-0 z-[1001] flex flex-col gap-3 bg-surface-100 p-4 md:hidden"
                        >
                            <VehicleVideoDock
                                :cameras="cameras"
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
import { useOnlineVehicleFromRoute } from '~/composables/useVehicleOnline';
import {
    useVehicleHistory,
    VEHICLE_HISTORY_KEY,
    HISTORY_MAP_WRAPPER_ID
} from '~/composables/useVehicleHistory';

const { vehicle } = useOnlineVehicleFromRoute();

/** Shared history state (period, playback, video/telemetry) for panel/map */
const context = useVehicleHistory(vehicle);
provide(VEHICLE_HISTORY_KEY, context);
const {
    cameras,
    videoOpen,
    activeCameraIds,
    activeCameras,
    toggleCamera,
    telemetryOpen
} = context;

/** Panel visibility switch below lg; the events feed shows by default */
const view = ref<PanelMapLayoutView>('panel');

/** Map renders only when the Mapbox token is configured */
const hasToken = computed<boolean>(() =>
    Boolean(useRuntimeConfig().public.mapboxToken)
);
</script>
