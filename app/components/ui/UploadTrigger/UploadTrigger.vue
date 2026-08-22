<template>
    <FileUpload
        ref="fu"
        :name="name"
        :multiple="false"
        accept="image/*"
        :max-file-size="1000000"
        mode="advanced"
        :pt="{
            header: { class: 'hidden!' },
            content: { class: 'p-0' },
            root: {class: 'border-none bg-transparent'}
        }"
        @select="emit('select', $event)"
    >
        <template #content="{ files, removeFileCallback }">
            <div v-if="files.length">
                <div class="flex items-center gap-1.5 cursor-pointer" @click="onChoose">
                    <Image
                        v-if="files[0]"
                        :src="files[0]?.objectURL"
                        alt=""
                        :pt="{
                            root: { class: 'size-10 border-full overflow-hidden rounded-full shrink-0' },
                            image: { class: 'size-full object-cover' }
                        }"
                    />
                    <p class="text-xs text-surface-600">Перетягніть файл або натисніть для завантаження PDF, JPG, PNG до 10 MB</p>
                    <Icon name="tabler:x-filled" class="size-5 text-red-600 ml-auto shrink-0" @click.stop="removeFileCallback"/>
                </div>
            </div>
        </template>
        <template #empty>
            <div class="flex items-center gap-1.5 cursor-pointer" @click="onChoose">
                <div class="shrink-0 flex justify-center items-center size-10 rounded-full border border-dashed border-surface-300">
                    <Icon name="tabler:plus" class="text-surface-600"/>
                </div>
                <p class="text-xs text-surface-600">Перетягніть файл або натисніть для завантаження PDF, JPG, PNG до 10 MB</p>
            </div>
        </template>
    </FileUpload>
</template>

<script setup lang="ts">
import type { FileUploadSelectEvent } from 'primevue/fileupload';

interface UploadTriggerProps {
    name: string;
}

defineProps<UploadTriggerProps>();

const emit = defineEmits<{
    select: [event: FileUploadSelectEvent];
}>();

const fu = ref();

const onChoose = () => {
    fu.value.choose();
};

</script>
