<template>
    <ConfirmDialog
        :group="group"
        :draggable="false"
        :style="{ width: '28.25rem' }"
        :pt="{ header: { style: { padding: '0' } } }"
    >
        <template #message>
            <div class="flex flex-col items-center gap-4 w-full pt-8">
                <div class="flex justify-center">
                    <div
                        class="border border-red-200 rounded-md flex flex-col items-center justify-center size-12 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
                    >
                        <Icon name="tabler:trash" class="size-6 text-red-500" />
                    </div>
                </div>
                <div class="flex flex-col gap-1 text-center">
                    <UiTypography variant="h3">{{ title }}</UiTypography>
                    <div class="text-sm text-surface-800 flex flex-col gap-1">
                        <p>
                            {{ message }}
                        </p>
                        <p>
                            <strong v-if="itemName" class="text-surface-950">
                                "{{ itemName }}"
                            </strong>
                            <template v-if="itemName">?</template>
                        </p>
                        <p v-if="warning">{{ warning }}</p>
                    </div>
                </div>
            </div>
        </template>
    </ConfirmDialog>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm';

interface ConfirmDeleteDialogProps {
    /** Dialog title, e.g. "Видалити водія?" */
    title: string;
    /** Confirmation text shown before the optional bold item name */
    message: string;
    /** Optional item name rendered bold (quoted) after the message */
    itemName?: string;
    /** Optional secondary warning line */
    warning?: string;
    /** Confirm button label; defaults to a generic "Видалити" */
    confirmLabel?: string;
    /** Cancel button label; defaults to a generic "Скасувати" */
    cancelLabel?: string;
    /** ConfirmationService group key (unique per concurrently-mounted dialog) */
    group?: string;
}

const visible = defineModel<boolean>('visible', { required: true });
const props = withDefaults(defineProps<ConfirmDeleteDialogProps>(), {
    itemName: undefined,
    warning: undefined,
    confirmLabel: undefined,
    cancelLabel: undefined,
    group: 'confirmDelete'
});

const emit = defineEmits<{ confirm: [] }>();

const { t } = useI18n();
const confirm = useConfirm();

/** Resets the external visible flag back to false */
const closeVisible = (): void => {
    if (visible.value) visible.value = false;
};

/**
 * Bridges v-model:visible into the imperative ConfirmationService.
 * Accepting emits `confirm` (the caller performs the deletion); all exits
 * flip the visible flag back to false.
 */
watch(visible, (open): void => {
    if (!open) return;
    confirm.require({
        group: props.group,
        rejectProps: {
            label: props.cancelLabel ?? t('common.cancel'),
            severity: 'secondary'
        },
        acceptProps: {
            label: props.confirmLabel ?? t('common.delete'),
            severity: 'danger'
        },
        accept: (): void => {
            emit('confirm');
            closeVisible();
        },
        reject: closeVisible,
        onHide: closeVisible
    });
});
</script>
