<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        :style="{ maxWidth: '41rem', width: '100%' }"
    >
        <template #header>
            <div class="text-center">
                <UiTypography variant="h3">
                    {{ $t('routes.edit.title') }}
                </UiTypography>
            </div>
        </template>

        <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
            <UiTabNav v-model:value="activeTab" :items="tabItems" size="sm" />

            <!-- Tab bodies use v-show (not v-if/TabPanels) so every field stays
                 mounted and regle errors remain live across tabs. -->
            <RoutesRouteEditGeneralTab v-show="activeTab === 'general'" />
            <RoutesRouteEditPointsTab v-show="activeTab === 'points'" />
            <RoutesRouteEditPriceTab v-show="activeTab === 'price'" />
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
                    :label="$t('routes.edit.submit')"
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
import type { Route } from '~/types/route';
import type { TabItem } from '~/components/ui/TabNav/TabNav.vue';
import {
    useRouteEditForm,
    ROUTE_EDIT_FORM_KEY,
    type RouteEditTabKey
} from '~/composables/useRouteEditForm';

interface RouteEditDialogProps {
    /** Route to edit; the dialog is only opened with an existing route */
    route: Route | null;
}

const visible = defineModel<boolean>('visible', { required: true });
const props = defineProps<RouteEditDialogProps>();

const { t } = useI18n();
const toast = useToast();
const { updateRoute } = useRoutes();

/** Shared edit-form state/validation, provided to the tab components */
const form = useRouteEditForm();
provide(ROUTE_EDIT_FORM_KEY, form);

const activeTab = ref<RouteEditTabKey>('general');

/** Tab definitions of the edit dialog */
const tabItems = computed<TabItem[]>(() => [
    { value: 'general', label: t('routes.edit.tabs.general') },
    { value: 'points', label: t('routes.edit.tabs.points') },
    { value: 'price', label: t('routes.edit.tabs.price') }
]);

const isSubmitDisabled = computed(
    (): boolean => form.r$.$invalid || form.r$.$pending
);

/** Re-hydrate (and reset to the first tab) whenever the dialog opens */
watch(
    [visible, () => props.route],
    ([isOpen]): void => {
        if (!isOpen || !props.route) return;
        activeTab.value = 'general';
        form.hydrate(props.route);
    },
    { immediate: true }
);

const onCancel = (): void => {
    visible.value = false;
};

const onSubmit = async (): Promise<void> => {
    if (!props.route) return;
    const { valid } = await form.r$.$validate();
    if (!valid) {
        activeTab.value = form.firstInvalidTab();
        return;
    }

    const payload = form.buildPayload(props.route);
    updateRoute(payload);

    toast.add({
        severity: 'success',
        summary: t('routes.edit.updated'),
        detail: payload.name,
        life: 2000
    });

    visible.value = false;
};
</script>
