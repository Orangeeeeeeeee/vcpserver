<template>
    <div
        class="aspect-video overflow-hidden rounded-lg bg-surface-950 shadow-md"
    >
        <UiVideoPlayer
            :src="camera.streamUrl"
            :poster="camera.posterUrl"
            :title="$t('objects.vehicles.detail.camera', { n: camera.number })"
            load="play"
            muted
            loop
        />
    </div>
</template>

<script setup lang="ts">
import type { VehicleCamera } from '~/types/online';

/** Onboard camera tile: Vidstack player over the mock camera stream */

interface CameraPlayerProps {
    camera: VehicleCamera;
}

defineProps<CameraPlayerProps>();
</script>
