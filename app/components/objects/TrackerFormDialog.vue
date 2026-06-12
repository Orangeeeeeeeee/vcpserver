<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        :style="{ maxWidth: '28.4rem', width: '100%' }"
    >
        <template #header>
            <div class="flex flex-col gap-0.5 text-center">
                <UiTypography variant="h3">{{ title }}</UiTypography>
                <p class="text-sm text-surface-800">{{ subtitle }}</p>
            </div>
        </template>

        <form
            class="flex flex-col gap-3.5"
            novalidate
            @submit.prevent="onSubmit"
        >
            <SharedAppFormField
                v-if="!isEdit"
                id="trackerImei"
                name="imei"
                :label="$t('objects.trackers.modal.imei')"
                :error="r$.$fields.imei.$errors"
            >
                <InputText
                    id="trackerImei"
                    v-model="state.imei"
                    :placeholder="$t('objects.trackers.modal.imeiPlaceholder')"
                    :invalid="r$.$fields.imei.$invalid"
                    fluid
                />
            </SharedAppFormField>
            <div v-else class="flex flex-col gap-1.5">
                <span class="text-sm font-normal text-surface-700">
                    {{ $t('objects.trackers.modal.imei') }}
                </span>
                <span class="text-base text-surface-950">
                    {{ state.imei }}
                </span>
            </div>

            <SharedAppFormField
                id="trackerCompany"
                name="company"
                :label="$t('objects.trackers.modal.company')"
                :error="r$.$fields.company.$errors"
            >
                <Select
                    id="trackerCompany"
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
                id="trackerTransport"
                name="transport"
                :label="$t('objects.trackers.modal.transport')"
                :error="r$.$fields.transport.$errors"
            >
                <Select
                    id="trackerTransport"
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
                id="trackerParams"
                name="params"
                :label="$t('objects.trackers.modal.params')"
                :error="r$.$fields.params.$errors"
            >
                <MultiSelect
                    id="trackerParams"
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
                    :label="$t('common.cancel')"
                    severity="secondary"
                    fluid
                    @click="onCancel"
                />
                <Button
                    :label="submitLabel"
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
import type { Tracker } from '~/types/tracker';

interface TrackerFormState {
    imei: string;
    company: string | null;
    transport: string | null;
    params: string[];
}

interface TrackerFormDialogProps {
    /** Tracker to edit; null = add mode */
    tracker: Tracker | null;
}

const visible = defineModel<boolean>('visible', { required: true });
const props = defineProps<TrackerFormDialogProps>();

const { t } = useI18n();
const toast = useToast();
const {
    companies,
    transportModels,
    params: paramsList,
    addTracker,
    updateTracker
} = useTrackers();

/** Builds the empty (add-mode) form state */
const emptyState = (): TrackerFormState => ({
    imei: '',
    company: null,
    transport: null,
    params: []
});

const state = reactive<TrackerFormState>(emptyState());

const { r$ } = useRegle(
    state,
    {
        imei: { required: withMessage(required, 'validation.required') },
        company: { required: withMessage(required, 'validation.required') },
        transport: { required: withMessage(required, 'validation.required') },
        params: { required: withMessage(required, 'validation.required') }
    },
    { lazy: true }
);

const isEdit = computed((): boolean => props.tracker !== null);
const title = computed((): string =>
    t(
        isEdit.value
            ? 'objects.trackers.modal.editTitle'
            : 'objects.trackers.modal.title'
    )
);
const subtitle = computed((): string =>
    t(
        isEdit.value
            ? 'objects.trackers.modal.editSubtitle'
            : 'objects.trackers.modal.subtitle'
    )
);
const submitLabel = computed((): string =>
    t(
        isEdit.value
            ? 'objects.trackers.modal.editSubmit'
            : 'objects.trackers.modal.submit'
    )
);

/** Whether the submit button should be disabled */
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Resets to empty (add) or hydrates from the tracker (edit) */
const hydrate = (tracker: Tracker | null): void => {
    Object.assign(state, emptyState());
    if (tracker) {
        state.imei = tracker.imei;
        state.company = tracker.company;
        state.transport = tracker.transport;
        state.params = [...tracker.params];
    }
    r$.$reset();
};

/** Re-hydrate whenever the dialog opens */
watch(
    [visible, () => props.tracker],
    ([isOpen]): void => {
        if (!isOpen) return;
        hydrate(props.tracker);
    },
    { immediate: true }
);

const onCancel = (): void => {
    visible.value = false;
};

/** Validates, creates/updates the tracker via composable, toasts, and closes */
const onSubmit = async (): Promise<void> => {
    const { valid } = await r$.$validate();
    if (!valid) return;

    const payload = {
        company: state.company as string,
        transport: state.transport as string,
        params: state.params
    };

    if (props.tracker) {
        updateTracker({ id: props.tracker.id, ...payload });
    } else {
        addTracker({ imei: state.imei.trim(), ...payload });
    }

    toast.add({
        severity: 'success',
        summary: t(
            props.tracker
                ? 'objects.trackers.modal.updated'
                : 'objects.trackers.modal.added'
        ),
        detail: state.imei,
        life: 2000
    });

    visible.value = false;
};
</script>
