<template>
    <div class="flex flex-col gap-1.5">
        <span v-if="label" class="text-sm font-normal text-surface-700">
            {{ label }}
        </span>
        <button
            type="button"
            class="flex w-full items-center gap-3 rounded-md border border-dashed px-4 py-4 text-left transition-colors"
            :class="
                isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-surface-300 hover:border-surface-400'
            "
            @click="open"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
        >
            <span
                class="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-100"
            >
                <Icon name="tabler:plus" class="size-5 text-surface-700" />
            </span>
            <span class="text-sm text-surface-700">{{ fileName || hint }}</span>
        </button>
        <input
            ref="inputRef"
            type="file"
            class="hidden"
            :accept="accept"
            @change="onChange"
        />
    </div>
</template>

<script setup lang="ts">
interface FileDropzoneProps {
    /** Field label shown above the dropzone */
    label?: string;
    /** Hint text shown when no file is selected */
    hint?: string;
    /** `accept` attribute for the file input, e.g. `image/*` */
    accept?: string;
    /** Maximum file size in megabytes; larger files are ignored */
    maxSizeMb?: number;
    /** Name of the currently selected file (controlled by the parent) */
    fileName?: string;
}

const props = withDefaults(defineProps<FileDropzoneProps>(), {
    label: undefined,
    hint: undefined,
    accept: undefined,
    maxSizeMb: 10,
    fileName: undefined
});

const emit = defineEmits<{ select: [file: File] }>();

const inputRef = useTemplateRef<HTMLInputElement>('inputRef');
const isDragging = ref<boolean>(false);

/** Opens the native file picker */
const open = (): void => {
    inputRef.value?.click();
};

/** Emits the file if it passes the size check (UI-only — no real upload) */
const handleFile = (file: File | undefined): void => {
    if (!file) return;
    if (file.size > props.maxSizeMb * 1024 * 1024) return;
    emit('select', file);
};

/** Handles selection via the native input */
const onChange = (event: Event): void => {
    handleFile((event.target as HTMLInputElement).files?.[0]);
};

/** Handles a dropped file */
const onDrop = (event: DragEvent): void => {
    isDragging.value = false;
    handleFile(event.dataTransfer?.files?.[0]);
};
</script>
