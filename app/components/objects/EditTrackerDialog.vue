<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        :style="{ width: '28rem' }"
    >
        <template #header>
            <div class="flex flex-col gap-2 text-center">
                <UiTypography variant="h3">
                    {{ $t('objects.trackers.modal.editTitle') }}
                </UiTypography>
                <p class="text-sm text-[var(--p-surface-800)]">
                    {{ $t('objects.trackers.modal.editSubtitle') }}
                </p>
            </div>
        </template>

        <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
            <div class="flex flex-col gap-1.5">
                <span class="text-sm font-normal text-[var(--p-surface-700)]">
                    {{ $t('objects.trackers.modal.imei') }}
                </span>
                <span class="text-base text-[var(--p-surface-950)]">
                    {{ tracker?.imei }}
                </span>
            </div>

            <SharedAppFormField
                id="editTrackerCompany"
                name="company"
                :label="$t('objects.trackers.modal.company')"
                :error="r$.$fields.company.$errors[0]"
            >
                <Select
                    id="editTrackerCompany"
                    v-model="state.company"
                    :options="companies"
                    :placeholder="
                        $t('objects.trackers.modal.companyPlaceholder')
                    "
                    :invalid="r$.$fields.company.$invalid"
                    fluid
                />
            </SharedAppFormField>

            <SharedAppFormField
                id="editTrackerTransport"
                name="transport"
                :label="$t('objects.trackers.modal.transport')"
                :error="r$.$fields.transport.$errors[0]"
            >
                <Select
                    id="editTrackerTransport"
                    v-model="state.transport"
                    :options="transportModels"
                    :placeholder="
                        $t('objects.trackers.modal.transportPlaceholder')
                    "
                    :invalid="r$.$fields.transport.$invalid"
                    fluid
                />
            </SharedAppFormField>

            <SharedAppFormField
                id="editTrackerParams"
                name="params"
                :label="$t('objects.trackers.modal.params')"
                :error="r$.$fields.params.$errors[0]"
            >
                <MultiSelect
                    id="editTrackerParams"
                    v-model="state.params"
                    :options="paramsList"
                    display="chip"
                    :placeholder="
                        $t('objects.trackers.modal.paramsPlaceholder')
                    "
                    :invalid="r$.$fields.params.$invalid"
                    fluid
                />
            </SharedAppFormField>
        </form>

        <template #footer>
            <div class="grid grid-cols-2 w-full gap-3">
                <Button
                    :label="$t('objects.trackers.modal.cancel')"
                    severity="secondary"
                    fluid
                    @click="onCancel"
                />
                <Button
                    :label="$t('objects.trackers.modal.editSubmit')"
                    :disabled="isSubmitDisabled"
                    fluid
                    @click="onSubmit"
                />
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import { useToast } from 'primevue/usetoast';
import type { Tracker } from '~/composables/useTrackers';

interface EditTrackerFormState {
    company: string | null;
    transport: string | null;
    params: string[];
}

interface EditTrackerDialogProps {
    /** Tracker being edited; null when no row is selected */
    tracker: Tracker | null;
}

const visible = defineModel<boolean>('visible', { required: true });
const props = defineProps<EditTrackerDialogProps>();

const { t } = useI18n();
const toast = useToast();
const {
    companies,
    transportModels,
    params: paramsList,
    updateTracker
} = useTrackers();

const state = reactive<EditTrackerFormState>({
    company: null,
    transport: null,
    params: []
});

const { r$ } = useRegle(
    state,
    {
        company: { required: withMessage(required, 'validation.required') },
        transport: { required: withMessage(required, 'validation.required') },
        params: { required: withMessage(required, 'validation.required') }
    },
    { lazy: true }
);

/** Whether the submit button should be disabled */
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Hydrates form state from the incoming tracker prop */
watch(
    () => props.tracker,
    (next): void => {
        if (!next) return;
        state.company = next.company;
        state.transport = next.transport;
        state.params = [...next.params];
        r$.$reset();
    },
    { immediate: true }
);

/** Closes the dialog without applying changes */
const onCancel = (): void => {
    visible.value = false;
};

/** Validates, updates the tracker via composable, toasts, and closes */
const onSubmit = async (): Promise<void> => {
    if (!props.tracker) return;
    const result = await r$.$validate();
    if (!result) return;

    updateTracker({
        id: props.tracker.id,
        company: state.company as string,
        transport: state.transport as string,
        params: state.params
    });

    toast.add({
        severity: 'success',
        summary: t('objects.trackers.modal.updated'),
        detail: props.tracker.imei,
        life: 2000
    });

    visible.value = false;
};
</script>
