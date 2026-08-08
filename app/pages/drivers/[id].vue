<template>
    <div>
        <SharedPageLayout :title="driver.name" :tabs="tabs">
            <template #content>
                <div
                    class="overflow-hidden md:border md:border-surface-300 rounded-lg"
                >
                    <!-- Identity header -->
                    <div
                        class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 md:mb-0 md:p-5 md:border-b md:border-surface-300"
                    >
                        <div class="flex items-center gap-3 min-w-0 lg:gap-5">
                            <Avatar
                                :label="driver.initials"
                                shape="circle"
                                size="large"
                                class="font-semibold size-12 shrink-0 md:size-16"
                            />
                            <div class="flex flex-col min-w-0 grow">
                                <div
                                    class="flex items-center gap-1 min-w-0 md:gap-4"
                                >
                                    <h4
                                        class="font-semibold text-surface-900 md:truncate text-lg md:text-xl font-manrope"
                                        :title="driver.name"
                                    >
                                        {{ driver.name }}
                                    </h4>
                                    <Tag
                                        :severity="statusSeverity"
                                        :value="statusLabel"
                                        class="ml-auto"
                                    />
                                </div>
                                <span
                                    class="text-surface-700 md:truncate md:text-lg"
                                    :title="driver.company"
                                >
                                    {{ driver.company }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="flex flex-col gap-2 text-sm md:text-base text-surface-900 md:gap-1"
                        >
                            <div class="flex items-center gap-2">
                                <Icon
                                    name="tabler:phone"
                                    class="size-5 text-surface-600 shrink-0"
                                />
                                <span>{{ driver.phone }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon
                                    name="tabler:mail"
                                    class="size-5 text-surface-600 shrink-0"
                                />
                                <span class="md:truncate" :title="driver.email">{{ driver.email }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Sections -->
                    <div class="md:p-5">
                        <section
                            v-if="driver.comment"
                            class="mb-3 pb-2 md:pb-3 lg:pb-5 lg:mb-4 border-b border-surface-200"
                        >
                            <h5
                                class="font-semibold text-surface-950 mb-1.5 lg:text-lg lg:mb-2 md:font-medium"
                            >
                                {{
                                    $t(
                                        'objects.drivers.detail.sections.comment'
                                    )
                                }}
                            </h5>
                            <p
                                class="text-surface-700 text-sm/tight md:max-w-1/2"
                            >
                                {{ driver.comment }}
                            </p>
                        </section>

                        <section
                            class="mb-3 pb-2 md:pb-3 border-b border-surface-200"
                        >
                            <h5
                                class="font-semibold text-surface-950 mb-1.5 lg:text-lg lg:mb-2 md:font-medium"
                            >
                                {{
                                    $t(
                                        'objects.drivers.detail.sections.vehicle'
                                    )
                                }}
                            </h5>
                            <div
                                class="md:flex md:flex-col md:gap-2 lg:gap-0.5"
                            >
                                <p
                                    class="text-sm lg:text-base text-surface-800 font-medium"
                                >
                                    {{ driver.transport }}
                                </p>
                                <p
                                    class="text-sm lg:text-base text-surface-700 font-medium"
                                >
                                    {{
                                        $t(
                                            'objects.drivers.detail.fields.vehicleIdPrefix'
                                        )
                                    }}
                                    {{ driver.transportId }}
                                </p>
                            </div>
                        </section>

                        <section
                            class="mb-3 pb-2 md:pb-3 border-b border-surface-200"
                        >
                            <h5
                                class="font-semibold text-surface-950 mb-1.5 lg:text-lg lg:mb-2 md:font-medium"
                            >
                                {{
                                    $t(
                                        'objects.drivers.detail.sections.license'
                                    )
                                }}
                            </h5>
                            <div
                                class="flex flex-col gap-2 text-sm lg:text-base text-surface-900 lg:gap-1"
                            >
                                <div class="flex items-center gap-2">
                                    <Icon
                                        name="tabler:id"
                                        class="size-5 text-surface-600 shrink-0"
                                    />
                                    <span>{{ driver.license.id }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Icon
                                        name="tabler:calendar"
                                        class="size-5 text-surface-600 shrink-0"
                                    />
                                    <span>{{ driver.license.expiresAt }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Icon
                                        name="tabler:license"
                                        class="size-5 text-surface-600 shrink-0"
                                    />
                                    <span>{{ driver.license.categories }}</span>
                                </div>
                            </div>
                        </section>

                        <section class="mb-3 pb-2 border-b border-surface-200">
                            <h5
                                class="font-semibold text-surface-950 mb-1.5 lg:text-lg lg:mb-2 md:font-medium"
                            >
                                {{ $t('objects.drivers.detail.sections.work') }}
                            </h5>
                            <div class="md:flex md:flex-col md:gap-2 lg:gap-1">
                                <p
                                    class="text-sm lg:text-base text-surface-800"
                                >
                                    <span class="text-surface-700">
                                        {{
                                            $t(
                                                'objects.drivers.detail.fields.startedAt'
                                            )
                                        }}:
                                    </span>
                                    {{ driver.startedAt }}
                                </p>
                                <p
                                    class="text-sm lg:text-base text-surface-800"
                                >
                                    <span class="text-surface-700">
                                        {{
                                            $t(
                                                'objects.drivers.detail.fields.employment'
                                            )
                                        }}:
                                    </span>
                                    {{ driver.employment }}
                                </p>
                            </div>
                        </section>

                        <section v-if="documents.length">
                            <h5
                                class="font-semibold text-surface-950 mb-1.5 lg:text-lg lg:mb-2 md:font-medium"
                            >
                                {{
                                    $t(
                                        'objects.drivers.detail.sections.documents'
                                    )
                                }}
                            </h5>
                            <ObjectsDriverDocumentList :documents="documents" />
                        </section>
                    </div>
                </div>
            </template>
        </SharedPageLayout>

        <ObjectsDriverFormDialog
            v-model:visible="formVisible"
            :driver="driver"
        />

        <SharedConfirmDeleteDialog
            v-model:visible="deleteVisible"
            :title="$t('objects.drivers.modal.deleteTitle')"
            :message="$t('objects.drivers.modal.deleteSubtitle')"
            :item-name="driver.name"
            :warning="$t('common.deleteWarning')"
            @confirm="onConfirmDelete"
        />

        <SharedClientTeleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:bus', to: ROUTES.OBJECTS_ONLINE },
                    {
                        label: $t('objects.tabs.drivers'),
                        to: ROUTES.OBJECTS_DRIVERS
                    },
                    { label: driver.name }
                ]"
            />
        </SharedClientTeleport>

        <SharedClientTeleport to="#page-actions-target">
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
                @click="onDelete"
            >
                <template #icon>
                    <Icon name="tabler:trash" class="size-5" />
                </template>
            </Button>
        </SharedClientTeleport>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { Driver, DriverDocument, DriverStatus } from '~/types/driver';
import type { PageLayoutTab } from '~/components/shared/PageLayout';
import { ROUTES } from '~/constants/routes';

type TagSeverity = 'success' | 'danger' | 'info' | 'warn';

const STATUS_SEVERITY: Record<DriverStatus, TagSeverity> = {
    active: 'success',
    blocked: 'danger',
    vacation: 'info',
    unavailable: 'warn'
};

const STATUS_LABEL_KEYS: Record<DriverStatus, string> = {
    active: 'objects.drivers.card.statusActive',
    blocked: 'objects.drivers.card.statusBlocked',
    vacation: 'objects.drivers.card.statusVacation',
    unavailable: 'objects.drivers.card.statusUnavailable'
};

const { t } = useI18n();
const route = useRoute();
const toast = useToast();
const { drivers, deleteDriver } = useDrivers();

const driverId = computed<string>(() => route.params.id as string);

const driverRef = computed<Driver | undefined>(() =>
    drivers.value.find((d) => d.id === driverId.value)
);

if (!driverRef.value) {
    throw createError({
        statusCode: 404,
        statusMessage: t('objects.drivers.detail.notFound'),
        fatal: true
    });
}

/** Narrowed driver after the not-found guard above */
const driver = computed<Driver>(() => driverRef.value as Driver);

/** PrimeVue Tag severity derived from the driver status */
const statusSeverity = computed<TagSeverity>(
    () => STATUS_SEVERITY[driver.value.status]
);

/** Localized status label resolved from i18n */
const statusLabel = computed<string>(() =>
    t(STATUS_LABEL_KEYS[driver.value.status])
);

const documents = computed<DriverDocument[]>(
    () => driver.value.documents ?? []
);

/** Driver-detail navigation tabs (current page + 2 cross-page links) */
const tabs = computed<PageLayoutTab[]>(() => [
    {
        label: t('objects.drivers.detail.tabs.info'),
        to: ROUTES.DRIVER_DETAIL(driverId.value)
    },
    {
        label: t('objects.drivers.detail.tabs.activeTrips'),
        to: ROUTES.DRIVER_TRIPS_ACTIVE(driverId.value),
        trailingIcon: 'tabler:arrow-up-right'
    },
    {
        label: t('objects.drivers.detail.tabs.archiveTrips'),
        to: ROUTES.DRIVER_TRIPS_ARCHIVE(driverId.value),
        trailingIcon: 'tabler:arrow-up-right'
    }
]);

const formVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);

const onEdit = (): void => {
    formVisible.value = true;
};

const onDelete = (): void => {
    deleteVisible.value = true;
};

/** Deletes the driver and navigates back to the list */
const onConfirmDelete = async (): Promise<void> => {
    const name = driver.value.name;
    deleteDriver(driver.value.id);
    toast.add({
        severity: 'success',
        summary: t('objects.drivers.modal.deleted'),
        detail: name,
        life: 2000
    });
    await navigateTo(ROUTES.OBJECTS_DRIVERS);
};
</script>
