<template>
    <div class="flex items-center justify-between gap-3">
        <!-- Camera chips (multi-select) -->
        <div class="flex min-w-0 flex-wrap items-center gap-1.5">
            <Chip
                v-for="camera in cameras"
                :key="camera.id"
                :label="
                    $t('objects.vehicles.detail.camera', { n: camera.number })
                "
                class="cursor-pointer select-none text-sm transition-colors"
                :class="
                    activeCameraIds.includes(camera.id)
                        ? 'bg-primary-100 text-primary-900'
                        : 'bg-transparent text-surface-700 hover:text-surface-900'
                "
                @click="emit('toggleCamera', camera.id)"
            />
        </div>

        <div class="flex shrink-0 items-center gap-2">
            <!-- Fullscreen of the map + video overlays (md+ only) -->
            <UiMapAction
                v-if="fullscreenTargetId"
                class="hidden md:inline-flex"
                icon="tabler:maximize"
                :aria-label="$t('objects.online.map.fullscreen')"
                @click="onFullscreen"
            />

            <!-- Close video: ✕ on md+, map icon on mobile -->
            <UiMapAction
                class="hidden md:inline-flex"
                icon="tabler:x"
                :aria-label="$t('objects.vehicles.detail.closeVideo')"
                @click="emit('close')"
            />
            <UiMapAction
                class="md:hidden"
                icon="tabler:map"
                :aria-label="$t('objects.online.mapView')"
                @click="emit('close')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { VehicleCamera } from '~/types/online';

/**
 * Video dock of the vehicle detail tabs: camera chips (which players are
 * shown), fullscreen and the close-video action. Sits under the map on md+
 * and on top of the mobile video screen.
 */

interface VideoDockProps {
    cameras: VehicleCamera[];
    /** Ids of the cameras whose players are shown */
    activeCameraIds: string[];
    /** Fullscreen target element id; the button hides when omitted */
    fullscreenTargetId?: string;
}

const props = defineProps<VideoDockProps>();

const emit = defineEmits<{
    toggleCamera: [id: string];
    close: [];
}>();

/** Browser Fullscreen API toggle on the target (players included) */
const onFullscreen = (): void => {
    if (document.fullscreenElement) {
        void document.exitFullscreen();
        return;
    }
    if (!props.fullscreenTargetId) return;
    void document.getElementById(props.fullscreenTargetId)?.requestFullscreen();
};
</script>
