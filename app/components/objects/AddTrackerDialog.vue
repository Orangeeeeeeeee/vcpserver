<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        :style="{ width: '28.4rem' }"
    >
        <template #header>
            <div class="flex flex-col gap-0.5 text-center">
                <UiTypography variant="h3">
                    {{ $t('objects.trackers.modal.title') }}
                </UiTypography>
                <p class="text-sm text-surface-800">
                    {{ $t('objects.trackers.modal.subtitle') }}
                </p>
            </div>
        </template>

        <form
            class="flex flex-col gap-3.5"
            novalidate
            @submit.prevent="onSubmit"
        >
            <SharedAppFormField
                id="addTrackerImei"
                name="imei"
                :label="$t('objects.trackers.modal.imei')"
                :error="r$.$fields.imei.$errors[0]"
            >
                <InputText
                    id="addTrackerImei"
                    v-model="state.imei"
                    :placeholder="$t('objects.trackers.modal.imeiPlaceholder')"
                    :invalid="r$.$fields.imei.$invalid"
                    fluid
                />
            </SharedAppFormField>

            <SharedAppFormField
                id="addTrackerCompany"
                name="company"
                :label="$t('objects.trackers.modal.company')"
                :error="r$.$fields.company.$errors[0]"
            >
                <Select
                    id="addTrackerCompany"
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
                id="addTrackerTransport"
                name="transport"
                :label="$t('objects.trackers.modal.transport')"
                :error="r$.$fields.transport.$errors[0]"
            >
                <Select
                    id="addTrackerTransport"
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
                id="addTrackerParams"
                name="params"
                :label="$t('objects.trackers.modal.params')"
                :error="r$.$fields.params.$errors[0]"
            >
                <MultiSelect
                    id="addTrackerParams"
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
                    :label="$t('objects.trackers.modal.submit')"
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

interface AddTrackerFormState {
    imei: string;
    company: string | null;
    transport: string | null;
    params: string[];
}

const visible = defineModel<boolean>('visible', { required: true });

const { t } = useI18n();
const toast = useToast();
const {
    companies,
    transportModels,
    params: paramsList,
    addTracker
} = useTrackers();

const initialState = (): AddTrackerFormState => ({
    imei: '',
    company: null,
    transport: null,
    params: []
});

const state = reactive<AddTrackerFormState>(initialState());

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

/** Whether the submit button should be disabled */
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Resets the form state and validation back to initial values */
const reset = (): void => {
    Object.assign(state, initialState());
    r$.$reset();
};

/** Closes the dialog and resets the form */
const onCancel = (): void => {
    visible.value = false;
    reset();
};

/** Validates, adds the tracker to the shared list, toasts, and closes */
const onSubmit = async (): Promise<void> => {
    const { valid } = await r$.$validate();
    if (!valid) return;

    addTracker({
        imei: state.imei.trim(),
        company: state.company as string,
        transport: state.transport as string,
        params: state.params
    });

    toast.add({
        severity: 'success',
        summary: t('objects.trackers.modal.added'),
        detail: state.imei,
        life: 2000
    });

    visible.value = false;
    reset();
};
</script>
