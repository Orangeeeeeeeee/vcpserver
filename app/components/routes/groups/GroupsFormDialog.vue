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
            <RoutesGroupsFormGeneralTab v-show="activeTab === 'general'" />
            <RoutesGroupsFormRoutesTab v-show="activeTab === 'routes'" />
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
import type { RouteGroup } from '~/types/route-group';
import type { TabItem } from '~/components/ui/TabNav/TabNav.vue';
import {
    useRouteGroupForm,
    ROUTE_GROUP_FORM_KEY,
    type RouteGroupFormTabKey
} from '~/composables/useRouteGroupForm';

interface RouteGroupFormDialogProps {
    /** Route group to edit; null = add mode */
    group: RouteGroup | null;
}

const visible = defineModel<boolean>('visible', { required: true });
const props = defineProps<RouteGroupFormDialogProps>();

const { t } = useI18n();
const toast = useToast();
const { addRouteGroup, updateRouteGroup } = useRouteGroups();

/** Shared form state/validation, provided to the tab components */
const form = useRouteGroupForm();
provide(ROUTE_GROUP_FORM_KEY, form);

const activeTab = ref<RouteGroupFormTabKey>('general');

/** Tab definitions for the form dialog */
const tabItems = computed<TabItem[]>(() => [
    { value: 'general', label: t('routes.groups.modal.tabs.general') },
    { value: 'routes', label: t('routes.groups.modal.tabs.routes') }
]);

const isEdit = computed((): boolean => props.group !== null);
const title = computed((): string =>
    t(
        isEdit.value
            ? 'routes.groups.modal.editTitle'
            : 'routes.groups.modal.title'
    )
);
const submitLabel = computed((): string =>
    t(
        isEdit.value
            ? 'routes.groups.modal.editSubmit'
            : 'routes.groups.modal.submit'
    )
);
const isSubmitDisabled = computed(
    (): boolean => form.r$.$invalid || form.r$.$pending
);

/** Re-hydrate (and reset to the first tab) whenever the dialog opens */
watch(
    [visible, () => props.group],
    ([isOpen]): void => {
        if (!isOpen) return;
        activeTab.value = 'general';
        form.hydrate(props.group);
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
    if (props.group) {
        updateRouteGroup({ id: props.group.id, ...payload });
    } else {
        addRouteGroup(payload);
    }

    toast.add({
        severity: 'success',
        summary: t(
            props.group
                ? 'routes.groups.modal.updated'
                : 'routes.groups.modal.added'
        ),
        detail: payload.name,
        life: 2000
    });

    visible.value = false;
};
</script>
