<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        :style="{ maxWidth: '41rem', width: '100%' }"
    >
        <template #header>
            <div class="text-center">
                <UiTypography variant="h3">{{ title }}</UiTypography>
            </div>
        </template>

        <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
            <UiTabNav v-model:value="activeTab" :items="tabItems" size="sm" />

            <!-- Tab bodies use v-show (not v-if/TabPanels) so every field stays
                 mounted and regle errors remain live across tabs. -->
            <ObjectsDriverFormGeneralTab v-show="activeTab === 'general'" />
            <ObjectsDriverFormContactsTab v-show="activeTab === 'contacts'" />
            <ObjectsDriverFormLicenseTab v-show="activeTab === 'license'" />
            <ObjectsDriverFormDocumentsTab v-show="activeTab === 'documents'" />
        </form>

        <template #footer>
            <div class="grid w-full md:w-3/5 md:mx-auto grid-cols-2 gap-3">
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
import { useToast } from 'primevue/usetoast';
import type { Driver } from '~/types/driver';
import type { TabItem } from '~/components/ui/TabNav/TabNav.vue';
import {
    useDriverForm,
    DRIVER_FORM_KEY,
    type DriverFormTabKey
} from '~/composables/useDriverForm';

interface DriverFormDialogProps {
    /** Driver to edit; null = add mode */
    driver: Driver | null;
}

const visible = defineModel<boolean>('visible', { required: true });
const props = defineProps<DriverFormDialogProps>();

const { t } = useI18n();
const toast = useToast();
const { addDriver, updateDriver } = useDrivers();

/** Shared form state/validation, provided to the tab components */
const form = useDriverForm();
provide(DRIVER_FORM_KEY, form);

const activeTab = ref<DriverFormTabKey>('general');

/** Tab definitions for the form dialog */
const tabItems = computed<TabItem[]>(() => [
    { value: 'general', label: t('objects.drivers.modal.tabs.general') },
    { value: 'contacts', label: t('objects.drivers.modal.tabs.contacts') },
    { value: 'license', label: t('objects.drivers.modal.tabs.license') },
    { value: 'documents', label: t('objects.drivers.modal.tabs.documents') }
]);

const isEdit = computed((): boolean => props.driver !== null);
const title = computed((): string =>
    t(
        isEdit.value
            ? 'objects.drivers.modal.editTitle'
            : 'objects.drivers.modal.title'
    )
);
const submitLabel = computed((): string =>
    t(
        isEdit.value
            ? 'objects.drivers.modal.editSubmit'
            : 'objects.drivers.modal.submit'
    )
);
const isSubmitDisabled = computed(
    (): boolean => form.r$.$invalid || form.r$.$pending
);

/** Re-hydrate (and reset to the first tab) whenever the dialog opens */
watch(
    [visible, () => props.driver],
    ([isOpen]): void => {
        if (!isOpen) return;
        activeTab.value = 'general';
        form.hydrate(props.driver);
    },
    { immediate: true }
);

const onCancel = (): void => {
    visible.value = false;
};

const onSubmit = async (): Promise<void> => {
    const { valid } = await form.r$.$validate();
    if (!valid) {
        activeTab.value = form.firstInvalidTab();
        return;
    }

    const payload = form.buildPayload();
    if (props.driver) {
        updateDriver({ id: props.driver.id, ...payload });
    } else {
        addDriver(payload);
    }

    toast.add({
        severity: 'success',
        summary: t(
            props.driver
                ? 'objects.drivers.modal.updated'
                : 'objects.drivers.modal.added'
        ),
        detail: payload.name,
        life: 2000
    });

    visible.value = false;
};
</script>
