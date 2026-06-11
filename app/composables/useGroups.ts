import type { Group, GroupColor, GroupStatus, GroupVehicle } from '~/types/group';
import { COMPANIES, GROUP_COLORS, generateGroups } from '~/mocks/groups';

/** A group status paired with its i18n label key */
export interface GroupStatusOption {
    value: GroupStatus;
    labelKey: string;
}

/** Fields needed to create a new group; the composable fills the id */
export interface AddGroupInput {
    name: string;
    company: string;
    status: GroupStatus;
    order: number;
    comment?: string;
    color: GroupColor;
    vehicles: GroupVehicle[];
}

/** Input for updating an existing group by id */
export interface UpdateGroupInput extends AddGroupInput {
    id: string;
}

/** Return type of the {@link useGroups} composable */
export interface UseGroupsReturn {
    /** Shared, reactive list of groups */
    groups: Ref<Group[]>;
    /** Distinct company names (for the filters and the group form) */
    companies: string[];
    /** Available accent colors (for the group form swatches) */
    colors: GroupColor[];
    /** Available statuses with i18n label keys (for filters and the form) */
    statuses: GroupStatusOption[];
    /** Prepends a new group to the list */
    addGroup: (input: AddGroupInput) => void;
    /** Updates an existing group by id */
    updateGroup: (input: UpdateGroupInput) => void;
    /** Removes a group from the list by id */
    deleteGroup: (id: string) => void;
}

/** Group statuses paired with their i18n label keys */
const GROUP_STATUSES: GroupStatusOption[] = [
    { value: 'active', labelKey: 'objects.groups.card.statusActive' },
    { value: 'inactive', labelKey: 'objects.groups.card.statusInactive' }
];

/**
 * Provides the (mock) list of groups, shared across the app via useState.
 * Filter / pagination are handled at the consumer level.
 * @returns {UseGroupsReturn} Composable
 */
export const useGroups = (): UseGroupsReturn => {
    const groups = useState<Group[]>('groups', () => generateGroups());

    /** Prepends a new group with a computed id. */
    const addGroup = (input: AddGroupInput): void => {
        const nextId =
            Math.max(0, ...groups.value.map((g) => Number(g.id) || 0)) + 1;
        const newGroup: Group = { ...input, id: String(nextId) };
        groups.value = [newGroup, ...groups.value];
    };

    /** Replaces an existing group by id. */
    const updateGroup = (input: UpdateGroupInput): void => {
        const idx = groups.value.findIndex((g) => g.id === input.id);
        if (idx === -1) return;
        const updated: Group = {
            ...(groups.value[idx] as Group),
            ...input
        };
        groups.value = [
            ...groups.value.slice(0, idx),
            updated,
            ...groups.value.slice(idx + 1)
        ];
    };

    /** Removes the group with the given id, if present. */
    const deleteGroup = (id: string): void => {
        groups.value = groups.value.filter((g) => g.id !== id);
    };

    return {
        groups,
        companies: COMPANIES,
        colors: GROUP_COLORS,
        statuses: GROUP_STATUSES,
        addGroup,
        updateGroup,
        deleteGroup
    };
};
