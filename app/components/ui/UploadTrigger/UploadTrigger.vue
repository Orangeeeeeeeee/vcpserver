<template>
    <FileUpload
        mode="advanced"
        custom-upload
        :auto="false"
        :accept="accept"
        :max-file-size="maxFileSize"
        :pt="{
            root: {
                style: 'border:0;padding:0;background:transparent'
            },
            header: {
                style: 'border:0;padding:0;background:transparent'
            },
            content: {
                style: 'border:0;padding:0;background:transparent'
            }
        }"
        @select="(event) => emit('select', event)"
    >
        <template #header="{ chooseCallback }">
            <button
                type="button"
                class="flex w-full items-center gap-3 text-left transition-colors hover:border-surface-400"
                @click="chooseCallback"
            >
                <span
                    class="flex size-10 shrink-0 items-center justify-center rounded-full border border-dashed border-surface-300"
                >
                    <Icon name="tabler:plus" class="size-5 text-surface-600" />
                </span>
                <span class="text-xs text-surface-600">{{ hint }}</span>
            </button>
        </template>
        <template #empty><span /></template>
    </FileUpload>
</template>

<script setup lang="ts">
import type { FileUploadSelectEvent } from 'primevue/fileupload';

interface UploadTriggerProps {
    /** Accepted MIME types, e.g. "image/*" */
    accept: string;
    /** Already-translated hint text shown next to the plus button */
    hint: string;
    /** Maximum file size in bytes */
    maxFileSize?: number;
}

withDefaults(defineProps<UploadTriggerProps>(), {
    maxFileSize: 10485760
});

const emit = defineEmits<{
    select: [event: FileUploadSelectEvent];
}>();
</script>
