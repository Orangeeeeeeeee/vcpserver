<template>
    <div
        class="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-surface-700 to-surface-950 shadow-md"
    >
        <button
            type="button"
            class="absolute inset-0 flex cursor-pointer items-center justify-center"
            :aria-label="
                $t('objects.vehicles.detail.camera', { n: camera.number })
            "
            @click="onPlay"
        >
            <span
                class="flex size-11 items-center justify-center rounded-full bg-surface-0/20 text-surface-0 backdrop-blur-sm transition-colors hover:bg-surface-0/30"
            >
                <Icon name="tabler:player-play" class="size-5" />
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { VehicleCamera } from '~/types/online';

/** Camera video placeholder: real streaming is not wired to an API yet */

interface CameraPlayerProps {
    camera: VehicleCamera;
}

defineProps<CameraPlayerProps>();

const { t } = useI18n();
const toast = useToast();

/** Video playback is mocked until the streaming API exists */
const onPlay = (): void => {
    toast.add({
        severity: 'info',
        summary: t('common.inDevelopment'),
        life: 2000
    });
};
</script>
