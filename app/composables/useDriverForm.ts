import { useRegle } from '@regle/core';
import { withMessage, required, email } from '@regle/rules';
import { useToast } from 'primevue/usetoast';
import type { FileUploadSelectEvent } from 'primevue/fileupload';
import type { Driver, DriverStatus, DriverDocument } from '~/types/driver';
import type { AddDriverInput } from '~/composables/useDrivers';
import { parseUaDate, formatUaDate } from '~/utils/date';

/** Identifier of a tab in the driver form dialog */
export type DriverFormTabKey = 'general' | 'contacts' | 'license' | 'documents';

/** A new-document draft captured in the Documents tab (file is UI-only) */
export interface DriverDocumentDraft {
    /** Stable v-for key (not persisted) */
    key: string;
    name: string;
    /** Captured file name; the real File is discarded (mock) */
    fileName?: string;
}

export interface DriverFormState {
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

/**
 * State, validation and helpers for the driver add/edit form. Created once in
 * `DriverFormDialog` and shared with the tab components via provide/inject.
 *
 * Note: the return type is intentionally inferred (not an explicit interface) so
 * the regle `r$` type flows through `DriverFormContext` without hand-typing it.
 */
export const useDriverForm = () => {
    const { t } = useI18n();
    const toast = useToast();
    const { employmentTypes, licenseCategories, statuses } = useDrivers();
    const { trackers } = useTrackers();

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
            transportId: {
                required: withMessage(required, 'validation.required')
            },
            startedAt: { required: withMessage(required, 'validation.required') },
            employment: {
                required: withMessage(required, 'validation.required')
            },
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
            trackers.value.find(
                (trk) => trk.transportId === state.transportId
            ) ?? null
    );

    /** Resets to empty (add) or hydrates from the driver (edit) */
    const hydrate = (driver: Driver | null): void => {
        Object.assign(state, emptyState());
        existingDocuments.value = [];

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

    const addDocumentRow = (): void => {
        state.documents.push(emptyDocument());
    };

    const removeDocumentRow = (index: number): void => {
        state.documents.splice(index, 1);
    };

    const onDocumentScanSelect = (
        index: number,
        event: FileUploadSelectEvent
    ): void => {
        const row = state.documents[index];
        if (row) row.fileName = event.files[0]?.name;
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

    /** Maps the first invalid regle field to its owning tab (cross-tab UX) */
    const firstInvalidTab = (): DriverFormTabKey => {
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

    /** Builds the driver payload from the current (validated) form state */
    const buildPayload = (): AddDriverInput => {
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

        return {
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
    };

    return {
        state,
        r$,
        existingDocuments,
        statusOptions,
        vehicleOptions,
        employmentTypes,
        licenseCategoryOptions: licenseCategories,
        hydrate,
        addDocumentRow,
        removeDocumentRow,
        onDocumentScanSelect,
        removeExistingDocument,
        onViewDocument,
        firstInvalidTab,
        buildPayload
    };
};

/** Shape shared between DriverFormDialog (provider) and its tabs (consumers) */
export type DriverFormContext = ReturnType<typeof useDriverForm>;

/** Injection key for the driver form context */
export const DRIVER_FORM_KEY: InjectionKey<DriverFormContext> =
    Symbol('driverForm');

/**
 * Injects the driver form context provided by `DriverFormDialog`.
 * @returns {DriverFormContext} The shared form state, validation and helpers.
 */
export const useDriverFormContext = (): DriverFormContext => {
    const ctx = inject(DRIVER_FORM_KEY);
    if (!ctx) {
        throw new Error(
            'useDriverFormContext must be used within DriverFormDialog'
        );
    }
    return ctx;
};
