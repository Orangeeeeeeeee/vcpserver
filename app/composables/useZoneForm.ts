import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import type {
    Zone,
    ZoneBinding,
    ZoneGeometry,
    ZoneNotificationChannel,
    ZoneNotificationType,
    ZoneTrigger,
    ZoneType
} from '~/types/zone';

/** One editable binding row of the groups / vehicles section */
export interface ZoneBindingFormRow {
    /** Stable identity key for TransitionGroup animations */
    key: string;
    /** Selected entity id — group id or vehicle id depending on the section */
    id: string;
    trigger: ZoneTrigger;
    notificationTypes: ZoneNotificationType[];
    channels: ZoneNotificationChannel[];
}

let _rowKey = 0;
const nextRowKey = (): string => String(++_rowKey);

/** Scalar fields of the zone form */
export interface ZoneFormState {
    company: string;
    type: ZoneType | null;
    name: string;
    description: string;
}

/** Builds the form state: prefilled from a zone (edit) or empty (create) */
const initialState = (zone?: Zone): ZoneFormState => ({
    company: zone?.companies[0] ?? '',
    type: zone?.types[0] ?? null,
    name: zone?.name ?? '',
    description: zone?.description ?? ''
});

/** Builds an empty binding row (the initial row of each section) */
const emptyRow = (): ZoneBindingFormRow => ({
    key: nextRowKey(),
    id: '',
    trigger: 'enter',
    notificationTypes: [],
    channels: []
});

/** Maps domain bindings to editable rows; at least one (empty) row remains */
const toRows = (bindings?: ZoneBinding[]): ZoneBindingFormRow[] =>
    bindings?.length
        ? bindings.map((b) => ({
              key: nextRowKey(),
              id: b.ids[0] ?? '',
              trigger: b.trigger,
              notificationTypes: [...b.notificationTypes],
              channels: [...b.channels]
          }))
        : [emptyRow()];

/**
 * State, validation and submit logic of the zone form. Created once in the
 * zone create/edit page and shared with child components via provide/inject.
 *
 * Note: the return type is intentionally inferred (see {@link UseZoneFormReturn})
 * so the regle `r$` type flows through without hand-typing it.
 * @param {Zone} [initialZone] Zone being edited; omit on the create page.
 * When present, the form is prefilled and submit updates instead of creating.
 * @returns {UseZoneFormReturn} Shared form state, validation and helpers
 */
export const useZoneForm = (initialZone?: Zone) => {
    const { createZone, updateZone } = useZones();

    const state = reactive<ZoneFormState>(initialState(initialZone));

    /** Drawn zone shape; null until the user draws on the map */
    const geometry = ref<ZoneGeometry | null>(initialZone?.geometry ?? null);

    /** Binding rows of the «Групи транспортів» section */
    const groupRows = ref<ZoneBindingFormRow[]>(
        toRows(initialZone?.groupBindings)
    );

    /** Binding rows of the «Транспорт» section */
    const vehicleRows = ref<ZoneBindingFormRow[]>(
        toRows(initialZone?.vehicleBindings)
    );

    const { r$ } = useRegle(
        state,
        {
            company: {
                required: withMessage(required, 'validation.required')
            },
            type: { required: withMessage(required, 'validation.required') },
            name: { required: withMessage(required, 'validation.required') }
        },
        { lazy: true }
    );

    /** Appends an empty row to the groups section */
    const addGroupRow = (): void => {
        groupRows.value = [...groupRows.value, emptyRow()];
    };

    /** Appends an empty row to the vehicles section */
    const addVehicleRow = (): void => {
        vehicleRows.value = [...vehicleRows.value, emptyRow()];
    };

    /** Removes the groups-section row at the given index */
    const removeGroupRow = (index: number): void => {
        groupRows.value = groupRows.value.filter((_, i) => i !== index);
    };

    /** Removes the vehicles-section row at the given index */
    const removeVehicleRow = (index: number): void => {
        vehicleRows.value = vehicleRows.value.filter((_, i) => i !== index);
    };

    /** Resets the whole form back to its initial (prefilled or empty) state */
    const reset = (): void => {
        Object.assign(state, initialState(initialZone));
        geometry.value = initialZone?.geometry ?? null;
        groupRows.value = toRows(initialZone?.groupBindings);
        vehicleRows.value = toRows(initialZone?.vehicleBindings);
        r$.$reset();
    };

    /** True when every non-empty row has notification types and channels */
    const rowsComplete = (rows: ZoneBindingFormRow[]): boolean =>
        rows
            .filter((row) => row.id !== '')
            .every(
                (row) =>
                    row.notificationTypes.length > 0 && row.channels.length > 0
            );

    /** Reactive submit gate: required fields, geometry and complete rows */
    const canSubmit = computed<boolean>(
        () =>
            !r$.$invalid &&
            geometry.value !== null &&
            rowsComplete(groupRows.value) &&
            rowsComplete(vehicleRows.value)
    );

    /** Maps a form row to a domain binding */
    const toBinding = (row: ZoneBindingFormRow): ZoneBinding => ({
        ids: row.id ? [row.id] : [],
        trigger: row.trigger,
        notificationTypes: [...row.notificationTypes],
        channels: [...row.channels]
    });

    /**
     * Validates and submits the form: empty rows (no ids) are dropped and the
     * zone is created, or updated when the form was opened with a zone.
     * @returns The saved zone, or null when validation fails
     */
    const submit = async (): Promise<Zone | null> => {
        const { valid } = await r$.$validate();
        if (!valid || !geometry.value) return null;

        const payload: Omit<Zone, 'id' | 'color'> = {
            companies: state.company ? [state.company] : [],
            types: state.type ? [state.type] : [],
            name: state.name.trim(),
            description: state.description.trim() || undefined,
            geometry: geometry.value,
            groupBindings: groupRows.value
                .filter((row) => row.id !== '')
                .map(toBinding),
            vehicleBindings: vehicleRows.value
                .filter((row) => row.id !== '')
                .map(toBinding)
        };

        return initialZone
            ? updateZone({
                  ...payload,
                  id: initialZone.id,
                  color: initialZone.color
              })
            : createZone(payload);
    };

    return {
        state,
        geometry,
        groupRows,
        vehicleRows,
        r$,
        addGroupRow,
        addVehicleRow,
        removeGroupRow,
        removeVehicleRow,
        reset,
        canSubmit,
        submit
    };
};

/** Shape shared between the zone form page (provider) and its children */
export type UseZoneFormReturn = ReturnType<typeof useZoneForm>;

/** Injection key for the zone form context */
export const ZONE_FORM_KEY: InjectionKey<UseZoneFormReturn> =
    Symbol('zoneForm');

/**
 * Injects the zone form context provided by the zone create/edit page.
 * @returns {UseZoneFormReturn} The shared form state, validation and helpers.
 */
export const useZoneFormContext = (): UseZoneFormReturn => {
    const ctx = inject(ZONE_FORM_KEY);
    if (!ctx) {
        throw new Error(
            'useZoneFormContext must be used within a zone form page'
        );
    }
    return ctx;
};
