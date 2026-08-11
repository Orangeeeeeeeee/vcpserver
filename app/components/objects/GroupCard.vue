<template>
    <!-- Wrapper keeps the collapsed height so expanding never stretches the grid row -->
    <div
        class="relative w-full h-full"
        :style="
            expanded && placeholderHeight !== null
                ? { height: `${placeholderHeight}px` }
                : undefined
        "
    >
        <div
            ref="cardRef"
            :class="[
                'bg-surface-100 border border-surface-300 rounded-lg w-full overflow-hidden flex flex-col',
                expanded ? 'absolute inset-x-0 top-0 z-10 shadow-lg' : 'h-full'
            ]"
        >
            <!-- Header: status + overflow menu + identity (tinted by group color) -->
            <div
                class="px-4 pt-3 pb-3"
                :style="{ backgroundColor: headerBackground }"
            >
                <div
                    class="flex items-start justify-between gap-2 relative mb-1"
                >
                    <Tag :severity="statusSeverity" :value="statusLabel" />
                    <button
                        type="button"
                        class="inline-flex cursor-pointer p-0 text-surface-800"
                        aria-haspopup="true"
                        @click.stop.prevent="toggleMenu"
                    >
                        <Icon
                            name="tabler:dots-vertical"
                            class="size-5 text-surface-800"
                        />
                    </button>
                    <Menu ref="menuRef" :model="menuItems" popup>
                        <template #item="{ item, props: itemProps }">
                            <a
                                v-bind="itemProps.action"
                                :class="[
                                    'flex items-center gap-1.5 cursor-pointer font-medium',
                                    (item as GroupMenuItem).danger
                                        ? 'text-red-600'
                                        : 'text-surface-900'
                                ]"
                            >
                                <span>{{ item.label }}</span>
                                <Icon
                                    :name="(item as GroupMenuItem).icon"
                                    :class="[
                                        'size-5',
                                        (item as GroupMenuItem).danger
                                            ? 'text-red-500'
                                            : 'text-surface-700'
                                    ]"
                                />
                            </a>
                        </template>
                    </Menu>
                </div>

                <!-- Identity -->
                <div class="flex min-w-0 flex-col pl-4">
                    <div
                        class="flex flex-col gap-1 relative min-w-0 before:absolute before:top-2 before:-left-3 before:w-[0.438rem] before:h-[0.438rem] before:rounded-full before:bg-[var(--dot-color)] before:content-['']"
                        :style="{ '--dot-color': dotColor }"
                    >
                        <span
                            class="font-medium text-surface-950 md:truncate text-base"
                            :title="group.name"
                        >
                            {{ group.name }}
                        </span>
                    </div>
                    <span class="text-sm text-surface-800 md:truncate" :title="group.company">
                        {{ group.company }}
                    </span>
                </div>
            </div>

            <!-- Body: comment + vehicles -->
            <div ref="bodyRef" class="p-3 flex flex-1 flex-col gap-2">
                <div
                    v-if="group.comment"
                    class="border-b border-surface-200 pb-1"
                >
                    <p
                        :class="[
                            'text-sm/tight text-surface-800',
                            expanded ? '' : 'line-clamp-3'
                        ]"
                    >
                        {{ group.comment }}
                    </p>
                </div>

                <ul ref="listRef" class="flex flex-col gap-1">
                    <li
                        v-for="(vehicle, index) in group.vehicles"
                        :key="vehicle.transportId"
                        :class="[
                            'flex items-center gap-1 text-sm text-surface-800',
                            { hidden: isRowHidden(index) }
                        ]"
                    >
                        <Icon
                            :name="VEHICLE_TYPE_ICONS[vehicle.type]"
                            class="size-4 text-surface-600 shrink-0"
                        />
                        <span
                            class="md:truncate text-sm uppercase text-surface-800"
                            :title="`${vehicle.transport} (ID: ${vehicle.transportId})`"
                        >
                            {{ vehicle.transport }} (ID:
                            {{ vehicle.transportId }})
                        </span>
                    </li>
                </ul>

                <button
                    v-if="showToggle"
                    ref="toggleRef"
                    type="button"
                    class="mt-auto flex cursor-pointer items-center gap-2 self-start text-sm font-medium text-surface-800 transition-colors hover:text-surface-950"
                    @click.stop.prevent="toggleExpanded"
                >
                    {{ expanded ? labels.collapse : labels.expand }}
                    <Icon
                        :name="
                            expanded
                                ? 'tabler:chevron-up'
                                : 'tabler:chevron-down'
                        "
                        class="size-5"
                    />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import type { Group, GroupVehicleType } from '~/types/group';
import { primitiveColors } from '~/theme/colors';
// Explicit import (despite Nuxt auto-import) so the Storybook build resolves it
import { useGroupCardCapacity } from '~/composables/useGroupCardCapacity';

export interface GroupCardLabels {
    statusActive: string;
    statusInactive: string;
    expand: string;
    collapse: string;
    menuEdit: string;
    menuDelete: string;
}

/** Tabler icon per vehicle type (Tabler has no "van" — truck-delivery is the closest) */
export const VEHICLE_TYPE_ICONS: Record<GroupVehicleType, string> = {
    truck: 'tabler:truck',
    bus: 'tabler:bus',
    van: 'tabler:truck-delivery'
};
</script>

<script setup lang="ts">
interface GroupMenuItem extends MenuItem {
    /** Tabler icon name, e.g. "tabler:pencil" */
    icon: string;
    /** When true, renders the item with red text (destructive action) */
    danger?: boolean;
}

interface GroupCardProps {
    group: Group;
    labels: GroupCardLabels;
}

const props = defineProps<GroupCardProps>();

const emit = defineEmits<{
    edit: [group: Group];
    delete: [group: Group];
}>();

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menuRef');
const cardRef = useTemplateRef<HTMLDivElement>('cardRef');
const bodyRef = useTemplateRef<HTMLDivElement>('bodyRef');
const listRef = useTemplateRef<HTMLUListElement>('listRef');
const toggleRef = useTemplateRef<HTMLButtonElement>('toggleRef');

/** Whether the full vehicle list is expanded */
const expanded = ref<boolean>(false);

/** Collapsed card height captured before expanding (keeps the grid row stable) */
const placeholderHeight = ref<number | null>(null);

/**
 * Toggles the expanded state. The collapsed height is measured first so the
 * wrapper can hold it while the card overlays the grid as an absolute box.
 */
const toggleExpanded = (): void => {
    if (!expanded.value) {
        placeholderHeight.value = cardRef.value?.offsetHeight ?? null;
        expanded.value = true;
    } else {
        expanded.value = false;
        placeholderHeight.value = null;
    }
};

/** Pastel header tint derived from the group color */
const headerBackground = computed<string>(
    () => primitiveColors[props.group.color]['100']
);

/** Solid identity dot color derived from the group color */
const dotColor = computed<string>(
    () => primitiveColors[props.group.color]['500']
);

/** PrimeVue Tag severity derived from the group status */
const statusSeverity = computed<'success' | 'danger'>(() =>
    props.group.status === 'active' ? 'success' : 'danger'
);

/** Localized status label resolved from the labels prop */
const statusLabel = computed<string>(() =>
    props.group.status === 'active'
        ? props.labels.statusActive
        : props.labels.statusInactive
);

const { visibleCount, showToggle } = useGroupCardCapacity({
    cardRef,
    bodyRef,
    listRef,
    toggleRef,
    itemCount: () => props.group.vehicles.length,
    expanded
});

/** Whether the row at the given index is hidden in the collapsed state */
const isRowHidden = (index: number): boolean =>
    !expanded.value && index >= visibleCount.value;

/** Toggles the overflow menu (PrimeVue popup mode) */
const toggleMenu = (event: Event): void => {
    menuRef.value?.toggle(event);
};

const menuItems = computed<GroupMenuItem[]>(() => [
    {
        label: props.labels.menuEdit,
        icon: 'tabler:pencil',
        command: (): void => emit('edit', props.group)
    },
    {
        label: props.labels.menuDelete,
        icon: 'tabler:trash',
        danger: true,
        command: (): void => emit('delete', props.group)
    }
]);
</script>
