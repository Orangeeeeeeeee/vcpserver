import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import type {
    Group,
    GroupColor,
    GroupStatus,
    GroupVehicle
} from '~/types/group';
import type { AddGroupInput } from '~/composables/useGroups';
import { vehicleTypeOf } from '~/mocks/groups';

/** Identifier of a tab in the group form dialog */
export type GroupFormTabKey = 'general' | 'vehicles';

export interface GroupFormState {
    name: string;
    company: string | null;
    status: GroupStatus | null;
    /** Manual sort position («Номер за порядком») */
    order: number | null;
    comment: string;
    color: GroupColor;
    /** Ordered vehicle list (drag order is preserved on save) */
    vehicles: GroupVehicle[];
}

/**
 * State, validation and helpers for the group add/edit form. Created once in
 * `GroupFormDialog` and shared with the tab components via provide/inject.
 *
 * Note: the return type is intentionally inferred (not an explicit interface) so
 * the regle `r$` type flows through `GroupFormContext` without hand-typing it.
 */
export const useGroupForm = () => {
    const { companies, colors, statuses } = useGroups();
    const { trackers } = useTrackers();
    const { t } = useI18n();

    /** Builds the empty (add-mode) form state */
    const emptyState = (): GroupFormState => ({
        name: '',
        company: null,
        status: null,
        order: null,
        comment: '',
        color: 'indigo',
        vehicles: []
    });

    const state = reactive<GroupFormState>(emptyState());

    const { r$ } = useRegle(
        state,
        {
            name: { required: withMessage(required, 'validation.required') },
            company: { required: withMessage(required, 'validation.required') },
            status: { required: withMessage(required, 'validation.required') },
            order: { required: withMessage(required, 'validation.required') }
        },
        { lazy: true }
    );

    /** Status select options: GroupStatus value + localized label */
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

    /** Builds a GroupVehicle from a tracker's transportId (type via model map) */
    const toGroupVehicle = (transportId: string): GroupVehicle | null => {
        const trk = trackers.value.find((t2) => t2.transportId === transportId);
        if (!trk) return null;
        return {
            transport: trk.transport,
            transportId,
            type: vehicleTypeOf(trk.transport)
        };
    };

    /**
     * MultiSelect model: ids derived from the ordered vehicles list.
     * Setter keeps existing rows in their (drag) order and appends new picks
     * at the end; deselecting removes the matching row.
     */
    const selectedVehicleIds = computed<string[]>({
        get: () => state.vehicles.map((v) => v.transportId),
        set: (ids) => {
            const kept = state.vehicles.filter((v) =>
                ids.includes(v.transportId)
            );
            const keptIds = new Set(kept.map((v) => v.transportId));
            const added = ids
                .filter((id) => !keptIds.has(id))
                .map(toGroupVehicle)
                .filter((v): v is GroupVehicle => v !== null);
            state.vehicles = [...kept, ...added];
        }
    });

    /** Removes a vehicle row (also unselects it in the MultiSelect) */
    const removeVehicle = (index: number): void => {
        state.vehicles.splice(index, 1);
    };

    /** Resets to empty (add) or hydrates from the group (edit) */
    const hydrate = (group: Group | null): void => {
        Object.assign(state, emptyState());

        if (group) {
            state.name = group.name;
            state.company = group.company;
            state.status = group.status;
            state.order = group.order;
            state.comment = group.comment ?? '';
            state.color = group.color;
            state.vehicles = group.vehicles.map((v) => ({ ...v }));
        }

        r$.$reset();
    };

    /** Maps the first invalid regle field to its owning tab (cross-tab UX) */
    const firstInvalidTab = (): GroupFormTabKey => {
        // all validated fields currently live on the General tab
        return 'general';
    };

    /** Builds the group payload from the current (validated) form state */
    const buildPayload = (): AddGroupInput => ({
        name: state.name.trim(),
        company: state.company as string,
        status: state.status as GroupStatus,
        order: state.order as number,
        comment: state.comment.trim() || undefined,
        color: state.color,
        vehicles: state.vehicles.map((v) => ({ ...v }))
    });

    return {
        state,
        r$,
        companies,
        colors,
        statusOptions,
        vehicleOptions,
        selectedVehicleIds,
        removeVehicle,
        hydrate,
        firstInvalidTab,
        buildPayload
    };
};

/** Shape shared between GroupFormDialog (provider) and its tabs (consumers) */
export type GroupFormContext = ReturnType<typeof useGroupForm>;

/** Injection key for the group form context */
export const GROUP_FORM_KEY: InjectionKey<GroupFormContext> =
    Symbol('groupForm');

/**
 * Injects the group form context provided by `GroupFormDialog`.
 * @returns {GroupFormContext} The shared form state, validation and helpers.
 */
export const useGroupFormContext = (): GroupFormContext => {
    const ctx = inject(GROUP_FORM_KEY);
    if (!ctx) {
        throw new Error(
            'useGroupFormContext must be used within GroupFormDialog'
        );
    }
    return ctx;
};
