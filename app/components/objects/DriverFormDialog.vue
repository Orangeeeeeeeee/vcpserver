<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        :style="{ width: '41rem' }"
    >
        <template #header>
            <div class="text-center">
                <UiTypography variant="h3">{{ title }}</UiTypography>
            </div>
        </template>

        <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
            <UiTabNav v-model:value="activeTab" :items="tabItems" size="sm" />

            <!-- Tab bodies use v-show (not TabPanels) so every input stays mounted
                 and regle errors remain live across tabs. -->

            <!-- General -->
            <div v-show="activeTab === 'general'" class="flex flex-col gap-5">
                <UiFileDropzone
                    :label="$t('objects.drivers.modal.avatar')"
                    :hint="$t('objects.drivers.modal.avatarHint')"
                    accept="image/*"
                    :file-name="state.avatarName"
                    @select="onAvatarSelect"
                />

                <div class="grid grid-cols-2 gap-4">
                    <SharedAppFormField
                        id="drvFirstName"
                        name="firstName"
                        :label="$t('objects.drivers.modal.firstName')"
                        :error="r$.$fields.firstName.$errors[0]"
                    >
                        <InputText
                            id="drvFirstName"
                            v-model="state.firstName"
                            :placeholder="
                                $t('objects.drivers.modal.firstNamePlaceholder')
                            "
                            :invalid="r$.$fields.firstName.$invalid"
                            fluid
                        />
                    </SharedAppFormField>

                    <SharedAppFormField
                        id="drvLastName"
                        name="lastName"
                        :label="$t('objects.drivers.modal.lastName')"
                        :error="r$.$fields.lastName.$errors[0]"
                    >
                        <InputText
                            id="drvLastName"
                            v-model="state.lastName"
                            :placeholder="
                                $t('objects.drivers.modal.lastNamePlaceholder')
                            "
                            :invalid="r$.$fields.lastName.$invalid"
                            fluid
                        />
                    </SharedAppFormField>
                </div>

                <SharedAppFormField
                    id="drvStatus"
                    name="status"
                    :label="$t('objects.drivers.modal.status')"
                    :error="r$.$fields.status.$errors[0]"
                >
                    <Select
                        id="drvStatus"
                        v-model="state.status"
                        :options="statusOptions"
                        option-label="label"
                        option-value="value"
                        :placeholder="
                            $t('objects.drivers.modal.statusPlaceholder')
                        "
                        :invalid="r$.$fields.status.$invalid"
                        fluid
                    />
                </SharedAppFormField>

                <SharedAppFormField
                    id="drvVehicle"
                    name="vehicle"
                    :label="$t('objects.drivers.modal.vehicle')"
                    :error="r$.$fields.transportId.$errors[0]"
                >
                    <Select
                        id="drvVehicle"
                        v-model="state.transportId"
                        :options="vehicleOptions"
                        option-label="label"
                        option-value="value"
                        filter
                        :placeholder="
                            $t('objects.drivers.modal.vehiclePlaceholder')
                        "
                        :invalid="r$.$fields.transportId.$invalid"
                        fluid
                    />
                </SharedAppFormField>

                <div class="grid grid-cols-2 gap-4">
                    <SharedAppFormField
                        id="drvStartedAt"
                        name="startedAt"
                        :label="$t('objects.drivers.modal.startedAt')"
                        :error="r$.$fields.startedAt.$errors[0]"
                    >
                        <DatePicker
                            id="drvStartedAt"
                            v-model="state.startedAt"
                            date-format="dd.mm.yy"
                            show-icon
                            icon-display="input"
                            :placeholder="
                                $t('objects.drivers.modal.startedAtPlaceholder')
                            "
                            :invalid="r$.$fields.startedAt.$invalid"
                            fluid
                        />
                    </SharedAppFormField>

                    <SharedAppFormField
                        id="drvEmployment"
                        name="employment"
                        :label="$t('objects.drivers.modal.employment')"
                        :error="r$.$fields.employment.$errors[0]"
                    >
                        <Select
                            id="drvEmployment"
                            v-model="state.employment"
                            :options="employmentTypes"
                            :placeholder="
                                $t(
                                    'objects.drivers.modal.employmentPlaceholder'
                                )
                            "
                            :invalid="r$.$fields.employment.$invalid"
                            fluid
                        />
                    </SharedAppFormField>
                </div>

                <SharedAppFormField
                    id="drvComment"
                    name="comment"
                    :label="$t('objects.drivers.modal.comment')"
                >
                    <Textarea
                        id="drvComment"
                        v-model="state.comment"
                        rows="3"
                        auto-resize
                        :placeholder="
                            $t('objects.drivers.modal.commentPlaceholder')
                        "
                        fluid
                    />
                </SharedAppFormField>
            </div>

            <!-- Contacts -->
            <div v-show="activeTab === 'contacts'" class="flex flex-col gap-5">
                <SharedAppFormField
                    id="drvPhone"
                    name="phone"
                    :label="$t('objects.drivers.modal.phone')"
                    :error="r$.$fields.phone.$errors[0]"
                >
                    <InputText
                        id="drvPhone"
                        v-model="state.phone"
                        :placeholder="
                            $t('objects.drivers.modal.phonePlaceholder')
                        "
                        :invalid="r$.$fields.phone.$invalid"
                        fluid
                    />
                </SharedAppFormField>

                <SharedAppFormField
                    id="drvEmail"
                    name="email"
                    :label="$t('objects.drivers.modal.email')"
                    :error="r$.$fields.email.$errors[0]"
                >
                    <InputText
                        id="drvEmail"
                        v-model="state.email"
                        type="email"
                        :placeholder="
                            $t('objects.drivers.modal.emailPlaceholder')
                        "
                        :invalid="r$.$fields.email.$invalid"
                        fluid
                    />
                </SharedAppFormField>
            </div>

            <!-- License -->
            <div v-show="activeTab === 'license'" class="flex flex-col gap-5">
                <SharedAppFormField
                    id="drvLicenseId"
                    name="licenseId"
                    :label="$t('objects.drivers.modal.licenseId')"
                    :error="r$.$fields.licenseId.$errors[0]"
                >
                    <InputText
                        id="drvLicenseId"
                        v-model="state.licenseId"
                        :placeholder="
                            $t('objects.drivers.modal.licenseIdPlaceholder')
                        "
                        :invalid="r$.$fields.licenseId.$invalid"
                        fluid
                    />
                </SharedAppFormField>

                <SharedAppFormField
                    id="drvLicenseExp"
                    name="licenseExpiresAt"
                    :label="$t('objects.drivers.modal.licenseExpiresAt')"
                    :error="r$.$fields.licenseExpiresAt.$errors[0]"
                >
                    <DatePicker
                        id="drvLicenseExp"
                        v-model="state.licenseExpiresAt"
                        date-format="dd.mm.yy"
                        show-icon
                        icon-display="input"
                        :placeholder="
                            $t(
                                'objects.drivers.modal.licenseExpiresAtPlaceholder'
                            )
                        "
                        :invalid="r$.$fields.licenseExpiresAt.$invalid"
                        fluid
                    />
                </SharedAppFormField>

                <SharedAppFormField
                    id="drvLicenseCat"
                    name="licenseCategories"
                    :label="$t('objects.drivers.modal.licenseCategories')"
                    :error="r$.$fields.licenseCategories.$errors[0]"
                >
                    <MultiSelect
                        id="drvLicenseCat"
                        v-model="state.licenseCategories"
                        :options="licenseCategoryOptions"
                        display="chip"
                        :placeholder="
                            $t(
                                'objects.drivers.modal.licenseCategoriesPlaceholder'
                            )
                        "
                        :invalid="r$.$fields.licenseCategories.$invalid"
                        fluid
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </MultiSelect>
                </SharedAppFormField>
            </div>

            <!-- Documents -->
            <div v-show="activeTab === 'documents'" class="flex flex-col gap-4">
                <ul v-if="existingDocuments.length" class="flex flex-col gap-2">
                    <li
                        v-for="doc in existingDocuments"
                        :key="doc.id"
                        class="flex items-center justify-between gap-3 rounded-md border border-surface-300 p-3"
                    >
                        <div class="flex min-w-0 items-center gap-2">
                            <Icon
                                name="tabler:file"
                                class="size-5 shrink-0 text-surface-600"
                            />
                            <span class="truncate text-sm text-surface-900">
                                {{ doc.name }}
                            </span>
                        </div>
                        <div class="flex shrink-0 items-center gap-1">
                            <Button
                                text
                                severity="secondary"
                                :aria-label="
                                    $t('objects.drivers.modal.viewDocument')
                                "
                                @click="onViewDocument(doc)"
                            >
                                <template #icon>
                                    <Icon
                                        name="tabler:eye"
                                        class="size-5 text-surface-800"
                                    />
                                </template>
                            </Button>
                            <Button
                                text
                                severity="danger"
                                :aria-label="
                                    $t('objects.drivers.modal.removeDocument')
                                "
                                @click="removeExistingDocument(doc.id)"
                            >
                                <template #icon>
                                    <Icon
                                        name="tabler:trash"
                                        class="size-5 text-red-500"
                                    />
                                </template>
                            </Button>
                        </div>
                    </li>
                </ul>

                <div
                    v-for="(row, index) in state.documents"
                    :key="row.key"
                    class="flex flex-col gap-3 rounded-md border border-surface-300 p-3 md:flex-row md:items-start"
                >
                    <div class="flex-1">
                        <SharedAppFormField
                            :id="`drvDocName${index}`"
                            :name="`docName${index}`"
                            :label="$t('objects.drivers.modal.documentName')"
                        >
                            <InputText
                                :id="`drvDocName${index}`"
                                v-model="row.name"
                                :placeholder="
                                    $t(
                                        'objects.drivers.modal.documentNamePlaceholder'
                                    )
                                "
                                fluid
                            />
                        </SharedAppFormField>
                    </div>
                    <div class="flex-1">
                        <UiFileDropzone
                            :label="$t('objects.drivers.modal.documentScan')"
                            :hint="$t('objects.drivers.modal.documentScanHint')"
                            accept="image/*,application/pdf"
                            :file-name="row.fileName"
                            @select="
                                (file) => onDocumentScanSelect(index, file)
                            "
                        />
                    </div>
                    <Button
                        text
                        severity="danger"
                        class="md:mt-7"
                        :aria-label="$t('objects.drivers.modal.removeDocument')"
                        @click="removeDocumentRow(index)"
                    >
                        <template #icon>
                            <Icon
                                name="tabler:trash"
                                class="size-5 text-red-500"
                            />
                        </template>
                    </Button>
                </div>

                <Button
                    type="button"
                    severity="secondary"
                    outlined
                    :label="$t('objects.drivers.modal.addDocument')"
                    @click="addDocumentRow"
                >
                    <template #icon>
                        <Icon name="tabler:plus" class="size-5" />
                    </template>
                </Button>
            </div>
        </form>

        <template #footer>
            <div class="grid w-full grid-cols-2 gap-3">
                <Button
                    :label="$t('objects.drivers.modal.cancel')"
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
import { withMessage, required, email } from '@regle/rules';
import { useToast } from 'primevue/usetoast';
import type {
    Driver,
    DriverStatus,
    DriverDocument
} from '~/components/objects/DriverCard.vue';
import { parseUaDate, formatUaDate } from '~/utils/date';
import type { TabItem } from '~/components/ui/TabNav/TabNav.vue';

/** A new-document draft captured in the Documents tab (file is UI-only) */
interface DriverDocumentDraft {
    /** Stable v-for key (not persisted) */
    key: string;
    name: string;
    /** Captured file name; the real File is discarded (mock) */
    fileName?: string;
}

interface DriverFormState {
    avatarName?: string;
    firstName: string;
    lastName: string;
    status: DriverStatus | null;
    /** Selected vehicle's transportId — drives transport/company on save */
    transportId: string | null;
    startedAt: Date | null;
    employment: string | null;
    comment: string;
    phone: string;
    email: string;
    licenseId: string;
    licenseExpiresAt: Date | null;
    licenseCategories: string[];
    documents: DriverDocumentDraft[];
}

interface DriverFormDialogProps {
    /** Driver to edit; null = add mode */
    driver: Driver | null;
}

const visible = defineModel<boolean>('visible', { required: true });
const props = defineProps<DriverFormDialogProps>();

const { t } = useI18n();
const toast = useToast();
const {
    addDriver,
    updateDriver,
    employmentTypes,
    licenseCategories: licenseCategoryOptions,
    statuses
} = useDrivers();
const { trackers } = useTrackers();

type TabKey = 'general' | 'contacts' | 'license' | 'documents';
const activeTab = ref<TabKey>('general');

/** Tab definitions for the form dialog */
const tabItems = computed<TabItem[]>(() => [
    { value: 'general', label: t('objects.drivers.modal.tabs.general') },
    { value: 'contacts', label: t('objects.drivers.modal.tabs.contacts') },
    { value: 'license', label: t('objects.drivers.modal.tabs.license') },
    { value: 'documents', label: t('objects.drivers.modal.tabs.documents') }
]);

/** Existing persisted documents (edit mode), shown with view/delete */
const existingDocuments = ref<DriverDocument[]>([]);

/** Monotonic counter for document draft keys (unique within this dialog) */
const docKeySeq = ref<number>(0);

/** Builds an empty document draft row */
const emptyDocument = (): DriverDocumentDraft => ({
    key: `doc-${docKeySeq.value++}`,
    name: '',
    fileName: undefined
});

/** Builds the empty (add-mode) form state */
const emptyState = (): DriverFormState => ({
    avatarName: undefined,
    firstName: '',
    lastName: '',
    status: null,
    transportId: null,
    startedAt: null,
    employment: null,
    comment: '',
    phone: '',
    email: '',
    licenseId: '',
    licenseExpiresAt: null,
    licenseCategories: [],
    documents: []
});

const state = reactive<DriverFormState>(emptyState());

const { r$ } = useRegle(
    state,
    {
        firstName: { required: withMessage(required, 'validation.required') },
        lastName: { required: withMessage(required, 'validation.required') },
        status: { required: withMessage(required, 'validation.required') },
        transportId: { required: withMessage(required, 'validation.required') },
        startedAt: { required: withMessage(required, 'validation.required') },
        employment: { required: withMessage(required, 'validation.required') },
        phone: { required: withMessage(required, 'validation.required') },
        email: {
            required: withMessage(required, 'validation.required'),
            email: withMessage(email, 'validation.email')
        },
        licenseId: { required: withMessage(required, 'validation.required') },
        licenseExpiresAt: {
            required: withMessage(required, 'validation.required')
        },
        licenseCategories: {
            required: withMessage(required, 'validation.required')
        }
    },
    { lazy: true }
);

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
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Status select options: DriverStatus value + localized label */
const statusOptions = computed(() =>
    statuses.map((s) => ({ value: s.value, label: t(s.labelKey) }))
);

/** Vehicle select options sourced from trackers: "MAN TGX (ID: TRK-112)" */
const vehicleOptions = computed(() =>
    trackers.value.map((trk) => ({
        value: trk.transportId,
        label: `${trk.transport} (ID: ${trk.transportId})`
    }))
);

/** The tracker matching the selected vehicle — provides transport + company */
const selectedTracker = computed(
    () =>
        trackers.value.find((trk) => trk.transportId === state.transportId) ??
        null
);

/** Resets to empty (add) or hydrates from the driver (edit) */
const hydrate = (driver: Driver | null): void => {
    Object.assign(state, emptyState());
    existingDocuments.value = [];
    activeTab.value = 'general';

    if (driver) {
        const [firstName = '', ...rest] = driver.name.split(' ');
        state.firstName = firstName;
        state.lastName = rest.join(' ');
        state.status = driver.status;
        state.transportId = driver.transportId;
        state.startedAt = parseUaDate(driver.startedAt);
        state.employment = driver.employment;
        state.comment = driver.comment ?? '';
        state.phone = driver.phone;
        state.email = driver.email;
        state.licenseId = driver.license.id;
        state.licenseExpiresAt = parseUaDate(driver.license.expiresAt);
        state.licenseCategories = driver.license.categories
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);
        existingDocuments.value = [...(driver.documents ?? [])];
    } else {
        state.documents = [emptyDocument()];
    }

    r$.$reset();
};

/** Re-hydrate whenever the dialog opens or the target driver changes */
watch(
    [visible, () => props.driver],
    ([isOpen]): void => {
        if (!isOpen) return;
        hydrate(props.driver);
    },
    { immediate: true }
);

const onAvatarSelect = (file: File): void => {
    state.avatarName = file.name;
};

const addDocumentRow = (): void => {
    state.documents.push(emptyDocument());
};

const removeDocumentRow = (index: number): void => {
    state.documents.splice(index, 1);
};

const onDocumentScanSelect = (index: number, file: File): void => {
    const row = state.documents[index];
    if (row) row.fileName = file.name;
};

const removeExistingDocument = (id: string): void => {
    existingDocuments.value = existingDocuments.value.filter(
        (d) => d.id !== id
    );
};

const onViewDocument = (doc: DriverDocument): void => {
    toast.add({
        severity: 'info',
        summary: t('objects.drivers.modal.viewDocument'),
        detail: doc.name,
        life: 2000
    });
};

const onCancel = (): void => {
    visible.value = false;
};

/** Maps the first invalid regle field to its owning tab (cross-tab UX) */
const firstInvalidTab = (): TabKey => {
    const f = r$.$fields;
    if (
        f.firstName.$invalid ||
        f.lastName.$invalid ||
        f.status.$invalid ||
        f.transportId.$invalid ||
        f.startedAt.$invalid ||
        f.employment.$invalid
    ) {
        return 'general';
    }
    if (f.phone.$invalid || f.email.$invalid) return 'contacts';
    return 'license';
};

const onSubmit = async (): Promise<void> => {
    const { valid } = await r$.$validate();
    if (!valid) {
        activeTab.value = firstInvalidTab();
        return;
    }

    const name = `${state.firstName.trim()} ${state.lastName.trim()}`.trim();
    const newDocuments: DriverDocument[] = state.documents
        .filter((d) => d.name.trim() || d.fileName)
        .map((d, index) => ({
            id: `doc-${Date.now()}-${index}`,
            name: d.name.trim(),
            fileName: d.fileName
        }));
    const documents = [...existingDocuments.value, ...newDocuments];
    const tracker = selectedTracker.value;

    const payload = {
        name,
        status: state.status as DriverStatus,
        transport: tracker?.transport ?? '',
        transportId: state.transportId as string,
        company: tracker?.company ?? '',
        phone: state.phone.trim(),
        email: state.email.trim(),
        startedAt: formatUaDate(state.startedAt),
        employment: state.employment as string,
        comment: state.comment.trim() || undefined,
        license: {
            id: state.licenseId.trim(),
            expiresAt: formatUaDate(state.licenseExpiresAt),
            categories: state.licenseCategories.join(', ')
        },
        documents
    };

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
        detail: name,
        life: 2000
    });

    visible.value = false;
};
</script>
