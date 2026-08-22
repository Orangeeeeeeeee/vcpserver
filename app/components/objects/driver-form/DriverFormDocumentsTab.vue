<template>
    <div class="flex flex-col gap-6">
        <ul v-if="existingDocuments.length" class="flex flex-col gap-3">
            <li
                v-for="doc in existingDocuments"
                :key="doc.id"
                class="flex items-center justify-between border-b border-surface-200 last:border-none"
            >
                <div class="flex min-w-0 items-center py-2 gap-3">
                    <button
                        type="button"
                        class="relative size-9 shrink-0 overflow-hidden rounded-full border border-surface-300 bg-surface-100"
                        :aria-label="$t('objects.drivers.modal.viewDocument')"
                        @click="onViewDocument(doc)"
                    >
                        <img
                            v-if="doc.previewUrl"
                            :src="doc.previewUrl"
                            alt=""
                            class="absolute inset-0 size-full object-cover"
                        />
                        <Icon
                            v-else
                            name="tabler:file-text"
                            class="absolute inset-0 m-auto size-7 text-surface-300"
                        />
                        <span
                            class="absolute inset-0 flex items-center justify-center bg-white/30 transition-colors hover:bg-white/10"
                        >
                            <Icon
                                name="tabler:eye"
                                class="size-4 text-surface-800"
                            />
                        </span>
                    </button>
                    <span class="md:truncate text-sm text-surface-900 font-medium" :title="doc.name">
                        {{ doc.name }}
                    </span>
                </div>
                <button
                    type="button"
                    class="shrink-0 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                    :aria-label="$t('objects.drivers.modal.removeDocument')"
                    @click="removeExistingDocument(doc.id)"
                >
                    <Icon name="tabler:trash" class="size-5" />
                </button>
            </li>
        </ul>

        <div
            v-for="(row, index) in state.documents"
            :key="row.key"
            class="flex flex-col gap-5 rounded-md md:flex-row md:items-start"
        >
            <div class="flex-1">
                <SharedAppFormField
                    :id="`drvDocName${index}`"
                    :name="`docName${index}`"
                    :label="$t('objects.drivers.modal.documentName')"
                >
                    <InputText
                        :id="`drvDocName${index}`"
                        v-model="row.name"
                        :placeholder="
                            $t('objects.drivers.modal.documentNamePlaceholder')
                        "
                        fluid
                    />
                </SharedAppFormField>
            </div>
            <div class="flex flex-1 flex-col gap-1.5">
                <span class="text-sm font-normal text-surface-700">
                    {{ $t('objects.drivers.modal.documentScan') }}
                </span>
                <UiUploadTrigger
                    @select="(event) => onDocumentScanSelect(index, event)"
                />
            </div>
            <button
                type="button"
                class="self-center shrink-0 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                :aria-label="$t('objects.drivers.modal.removeDocument')"
                @click="removeDocumentRow(index)"
            >
                <Icon name="tabler:trash" class="size-5" />
            </button>
        </div>

        <button
            type="button"
            class="flex cursor-pointer items-center gap-2 self-start text-sm font-medium text-surface-800 transition-colors hover:text-surface-900"
            @click="addDocumentRow"
        >
            <Icon name="tabler:plus" class="size-5 text-surface-700" />
            {{ $t('objects.drivers.modal.addDocument') }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { useDriverFormContext } from '~/composables/useDriverForm';

const {
    state,
    existingDocuments,
    addDocumentRow,
    removeDocumentRow,
    onDocumentScanSelect,
    removeExistingDocument,
    onViewDocument
} = useDriverFormContext();
</script>
