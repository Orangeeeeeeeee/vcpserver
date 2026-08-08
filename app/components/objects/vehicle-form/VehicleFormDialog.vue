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
            <ObjectsVehicleFormGeneralTab v-show="activeTab === 'general'" />
            <ObjectsVehicleFormExploitationTab
                v-show="activeTab === 'exploitation'"
            />
            <ObjectsVehicleFormSettingsTab v-show="activeTab === 'settings'" />
            <ObjectsVehicleFormFuelTab v-show="activeTab === 'fuel'" />
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
import type { Vehicle } from '~/types/vehicle';
import type { TabItem } from '~/components/ui/TabNav/TabNav.vue';
import {
    useVehicleForm,
    VEHICLE_FORM_KEY,
    type VehicleFormTabKey
} from '~/composables/useVehicleForm';

interface VehicleFormDialogProps {
    /** Vehicle to edit; null = add mode */
    vehicle: Vehicle | null;
}

const visible = defineModel<boolean>('visible', { required: true });
const props = defineProps<VehicleFormDialogProps>();

const { t } = useI18n();
const toast = useToast();
const { addVehicle, updateVehicle } = useVehicles();

/** Shared form state/validation, provided to the tab components */
const form = useVehicleForm();
provide(VEHICLE_FORM_KEY, form);

const activeTab = ref<VehicleFormTabKey>('general');

/** Error count per tab, driven by regle's $errors after $validate() */
const tabErrorCounts = computed(() => ({
    general:
        form.r$.$fields.company.$errors.length +
        form.r$.$fields.name.$errors.length +
        form.r$.$fields.type.$errors.length,
    exploitation: 0,
    settings: 0,
    fuel: 0
}));

/** Tab definitions for the form dialog */
const tabItems = computed<TabItem[]>(() => [
    {
        value: 'general',
        label: t('objects.vehicles.modal.tabs.general'),
        badge: tabErrorCounts.value.general || undefined
    },
    {
        value: 'exploitation',
        label: t('objects.vehicles.modal.tabs.exploitation'),
        badge: tabErrorCounts.value.exploitation || undefined
    },
    {
        value: 'settings',
        label: t('objects.vehicles.modal.tabs.settings'),
        badge: tabErrorCounts.value.settings || undefined
    },
    {
        value: 'fuel',
        label: t('objects.vehicles.modal.tabs.fuel'),
        badge: tabErrorCounts.value.fuel || undefined
    }
]);

const isEdit = computed((): boolean => props.vehicle !== null);
const title = computed((): string =>
    t(
        isEdit.value
            ? 'objects.vehicles.modal.editTitle'
            : 'objects.vehicles.modal.title'
    )
);
const submitLabel = computed((): string =>
    t(
        isEdit.value
            ? 'objects.vehicles.modal.editSubmit'
            : 'objects.vehicles.modal.submit'
    )
);
const isSubmitDisabled = computed(
    (): boolean => form.r$.$invalid || form.r$.$pending
);

/** Re-hydrate (and reset to the first tab) whenever the dialog opens */
watch(
    [visible, () => props.vehicle],
    ([isOpen]): void => {
        if (!isOpen) return;
        activeTab.value = 'general';
        form.hydrate(props.vehicle);
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
    if (props.vehicle) {
        updateVehicle({ id: props.vehicle.id, ...payload });
    } else {
        addVehicle(payload);
    }

    toast.add({
        severity: 'success',
        summary: t(
            props.vehicle
                ? 'objects.vehicles.modal.updated'
                : 'objects.vehicles.modal.added'
        ),
        detail: `${payload.brand} ${payload.model}`.trim(),
        life: 2000
    });

    visible.value = false;
};
</script>
