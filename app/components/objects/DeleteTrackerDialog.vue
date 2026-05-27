<template>
    <ConfirmDialog group="deleteTracker" :draggable="false">
        <template #message>
            <div class="flex flex-col items-center gap-4 w-full">
                <div class="flex flex-col gap-1 text-center">
                    <UiTypography variant="h3">
                        {{ $t('objects.trackers.modal.deleteTitle') }}
                    </UiTypography>
                    <div
                        class="text-sm text-[var(--p-surface-800)] flex flex-col gap-1"
                    >
                        <p>
                            {{ $t('objects.trackers.modal.deleteSubtitle') }}
                            <strong class="text-[var(--p-surface-950)]">
                                "{{ tracker?.transport }}"
                            </strong>
                            ?
                        </p>
                        <p>
                            {{ $t('objects.trackers.modal.deleteWarning') }}
                        </p>
                    </div>
                </div>
            </div>
        </template>
    </ConfirmDialog>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import type { Tracker } from '~/composables/useTrackers';

interface DeleteTrackerDialogProps {
    /** Tracker selected for deletion; null when no row is selected */
    tracker: Tracker | null;
}

const visible = defineModel<boolean>('visible', { required: true });
const props = defineProps<DeleteTrackerDialogProps>();

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const { deleteTracker } = useTrackers();

/** Resets the external visible flag back to false */
const closeVisible = (): void => {
    if (visible.value) visible.value = false;
};

/**
 * Bridges the external v-model:visible API into the imperative
 * ConfirmationService: opening the model triggers confirm.require,
 * and all exits (accept/reject/close) flip the flag back to false.
 */
watch(visible, (open): void => {
    if (!open || !props.tracker) return;
    const target = props.tracker;
    confirm.require({
        group: 'deleteTracker',
        rejectProps: {
            label: t('objects.trackers.modal.cancel'),
            severity: 'secondary'
        },
        acceptProps: {
            label: t('objects.trackers.modal.deleteSubmit'),
            severity: 'danger'
        },
        accept: (): void => {
            deleteTracker(target.id);
            toast.add({
                severity: 'success',
                summary: t('objects.trackers.actions.deleted'),
                detail: target.imei,
                life: 2000
            });
            closeVisible();
        },
        reject: closeVisible,
        onHide: closeVisible
    });
});
</script>
