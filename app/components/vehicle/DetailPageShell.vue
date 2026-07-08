<template>
    <div>
        <SharedPageLayout :title="vehicle.name" :tabs="tabs">
            <template #content>
                <slot></slot>
            </template>
        </SharedPageLayout>

        <ObjectsVehicleFormDialog
            v-model:visible="formVisible"
            :vehicle="catalogVehicle"
        />

        <SharedConfirmDeleteDialog
            v-model:visible="deleteVisible"
            :title="$t('objects.vehicles.modal.deleteTitle')"
            :message="$t('objects.vehicles.modal.deleteSubtitle')"
            :item-name="vehicle.name"
            :warning="$t('common.deleteWarning')"
            @confirm="onConfirmDelete"
        />

        <Teleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:bus', to: ROUTES.OBJECTS_ONLINE },
                    {
                        label: $t('objects.tabs.online'),
                        to: ROUTES.OBJECTS_ONLINE
                    },
                    { label: vehicle.name }
                ]"
            />
        </Teleport>

        <Teleport to="#page-actions-target">
            <Button
                severity="secondary"
                outlined
                :aria-label="$t('objects.vehicles.detail.share')"
                @click="onShare"
            >
                <template #icon>
                    <Icon name="tabler:share" class="size-5" />
                </template>
            </Button>
            <Button
                severity="secondary"
                outlined
                :aria-label="$t('common.edit')"
                @click="onEdit"
            >
                <template #icon>
                    <Icon name="tabler:pencil" class="size-5" />
                </template>
            </Button>
            <Button
                severity="danger"
                outlined
                :aria-label="$t('common.delete')"
                @click="deleteVisible = true"
            >
                <template #icon>
                    <Icon name="tabler:trash" class="size-5" />
                </template>
            </Button>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { OnlineVehicle } from '~/types/online';
import type { Vehicle } from '~/types/vehicle';
import type { PageLayoutTab } from '~/components/shared/PageLayout';
import { ROUTES } from '~/constants/routes';
import { generateOnlineVehicles } from '~/mocks/online';

/**
 * Shared shell of the vehicle detail tabs («Онлайн», «Історія»): page layout
 * with the tab nav, breadcrumbs and the share/edit/delete header actions with
 * their dialogs. Tab pages render their content into the default slot.
 */

interface DetailPageShellProps {
    /** Vehicle being viewed (resolved via useOnlineVehicleFromRoute) */
    vehicle: OnlineVehicle;
}

const props = defineProps<DetailPageShellProps>();

const { t } = useI18n();
const toast = useToast();

/** Shared online fleet state (delete mutates it) */
const fleet = useState<OnlineVehicle[]>('onlineVehicles', () =>
    generateOnlineVehicles()
);

/** Vehicle-detail navigation tabs (2 tab pages + 2 cross-page links) */
const tabs = computed<PageLayoutTab[]>(() => [
    {
        label: t('objects.vehicles.detail.tabs.online'),
        to: ROUTES.VEHICLE_DETAIL(props.vehicle.id)
    },
    {
        label: t('objects.vehicles.detail.tabs.history'),
        to: ROUTES.VEHICLE_HISTORY(props.vehicle.id)
    },
    {
        label: t('objects.vehicles.detail.tabs.activeTrips'),
        to: ROUTES.VEHICLE_TRIPS_ACTIVE(props.vehicle.id),
        trailingIcon: 'tabler:arrow-up-right'
    },
    {
        label: t('objects.vehicles.detail.tabs.archiveTrips'),
        to: ROUTES.VEHICLE_TRIPS_ARCHIVE(props.vehicle.id),
        trailingIcon: 'tabler:arrow-up-right'
    }
]);

const { vehicles: catalogVehicles } = useVehicles();

const formVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);

/** Catalog record behind the online vehicle; hydrates the edit form */
const catalogVehicle = ref<Vehicle | null>(null);

/** Copies the page link to the clipboard */
const onShare = async (): Promise<void> => {
    await navigator.clipboard.writeText(window.location.href);
    toast.add({
        severity: 'success',
        summary: t('objects.vehicles.detail.linkCopied'),
        life: 2000
    });
};

/**
 * Opens the catalog edit form. The online record is matched to the catalog
 * by name/id; without a match (mock sets can diverge) a stub toast shows.
 */
const onEdit = (): void => {
    const found =
        catalogVehicles.value.find((v) => v.name === props.vehicle.vehicleId) ??
        catalogVehicles.value.find(
            (v) => v.id === props.vehicle.id.replace('on-', '')
        );
    if (!found) {
        toast.add({
            severity: 'info',
            summary: t('common.inDevelopment'),
            life: 2000
        });
        return;
    }
    catalogVehicle.value = found;
    formVisible.value = true;
};

/** Deletes the vehicle from the online fleet and returns to the list */
const onConfirmDelete = async (): Promise<void> => {
    const removedId = props.vehicle.id;
    toast.add({
        severity: 'success',
        summary: t('objects.vehicles.modal.deleted'),
        detail: props.vehicle.name,
        life: 2000
    });
    // navigate first: removing the record would break the page's render
    await navigateTo(ROUTES.OBJECTS_ONLINE);
    fleet.value = fleet.value.filter((v) => v.id !== removedId);
};
</script>
