<template>
    <ul v-if="documents.length">
        <li
            v-for="doc in documents"
            :key="doc.id"
            class="flex items-center border-b border-surface-200 last:border-none py-3 gap-3 last:pb-0 first:pt-0"
        >
            <div class="flex min-w-0 items-center gap-3">
                <div
                    class="relative size-10 shrink-0 overflow-hidden rounded-full border border-surface-300 bg-surface-100"
                >
                    <Image
                        v-if="doc.previewUrl"
                        :src="doc.previewUrl"
                        alt=""
                        preview
                        :pt="{
                            root: { class: 'block size-full' },
                            image: { class: 'size-full object-cover' }
                        }"
                    >
                        <template #previewicon>
                            <Icon
                                name="tabler:eye"
                                class="size-5 text-primary-700"
                            />
                        </template>
                    </Image>
                    <Icon
                        v-else
                        name="tabler:file-text"
                        class="absolute inset-0 m-auto size-7 text-surface-300"
                    />
                </div>
                <span class="truncate text-sm text-surface-800 font-medium">
                    {{ doc.name }}
                </span>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { DriverDocument } from '~/types/driver';

interface DriverDocumentListProps {
    /** Documents to render; the list is hidden when empty */
    documents: DriverDocument[];
}

defineProps<DriverDocumentListProps>();
</script>

<style scoped>
/* PrimeVue's .p-image-preview-mask defaults to opacity:0 + hover:opacity:1.
   The mockup keeps the eye-icon overlay visible at rest. Unlayered scoped
   :deep() overrides the @layer primevue defaults. */
:deep(.p-image-preview-mask) {
    opacity: 1;
    background: rgba(255, 255, 255, 0.3);
    transition: background 0.2s;
}

:deep(.p-image-preview-mask:hover) {
    background: rgba(255, 255, 255, 0.1);
}
</style>
