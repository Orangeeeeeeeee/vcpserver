<template>
    <div class="hidden items-end gap-3 md:flex">
        <VehicleCameraPlayer
            v-for="camera in cameras"
            :key="camera.id"
            :camera="camera"
            class="w-56 lg:w-64"
        />
    </div>
</template>

<script setup lang="ts">
import type { VehicleCamera } from '~/types/online';

/** Row of active-camera preview players shown over a map (md+ only) */

interface CameraPreviewsProps {
    /** Active cameras in display order */
    cameras: VehicleCamera[];
}

defineProps<CameraPreviewsProps>();
</script>
