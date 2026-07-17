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
                expanded
                    ? 'absolute inset-x-0 top-0 z-10 min-h-full shadow-lg'
                    : 'h-full'
            ]"
        >
            <!-- Header: status + overflow menu + identity -->
            <div class="px-4 pt-3 pb-3 bg-surface-200">
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
                <div class="flex min-w-0 flex-col">
                    <span
                        class="font-medium text-surface-950 truncate text-base"
                    >
                        {{ group.name }}
                    </span>
                    <span class="text-sm text-surface-800 truncate">
                        {{ group.company }}
                    </span>
                </div>
            </div>

            <!-- Body: comment + route links -->
            <div class="p-3 flex flex-1 flex-col gap-2">
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

                <ul class="flex flex-col gap-1">
                    <li v-for="route in visibleRoutes" :key="route.id">
                        <NuxtLink
                            :to="ROUTES.ROUTE_DETAIL(route.id)"
                            class="inline-flex max-w-full items-center gap-1 text-sm text-surface-800 transition-colors hover:text-surface-950"
                        >
                            <span class="truncate">{{ route.name }}</span>
                            <Icon
                                name="tabler:arrow-up-right"
                                class="size-4 shrink-0 text-surface-600"
                            />
                        </NuxtLink>
                    </li>
                </ul>

                <button
                    v-if="routes.length > COLLAPSED_ROUTES"
                    type="button"
                    class="flex cursor-pointer items-center gap-2 self-start text-sm font-medium text-surface-800 transition-colors hover:text-surface-950"
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
import type { RouteGroup } from '~/types/route-group';
import { ROUTES } from '~/constants/routes';

export interface RouteGroupCardLabels {
    statusActive: string;
    statusInactive: string;
    expand: string;
    collapse: string;
    menuEdit: string;
    menuDelete: string;
}

/** A group route resolved to its display name (dead ids are filtered out upstream) */
export interface RouteGroupCardRoute {
    id: string;
    name: string;
}
</script>

<script setup lang="ts">
interface GroupMenuItem extends MenuItem {
    /** Tabler icon name, e.g. "tabler:pencil" */
    icon: string;
    /** When true, renders the item with red text (destructive action) */
    danger?: boolean;
}

interface RouteGroupCardProps {
    group: RouteGroup;
    /** Group routes resolved to display names, in group order */
    routes: RouteGroupCardRoute[];
    labels: RouteGroupCardLabels;
}

/** Number of route rows shown while the card is collapsed */
const COLLAPSED_ROUTES = 3;

const props = defineProps<RouteGroupCardProps>();

const emit = defineEmits<{
    edit: [group: RouteGroup];
    delete: [group: RouteGroup];
}>();

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menuRef');
const cardRef = useTemplateRef<HTMLDivElement>('cardRef');

/** Whether the full route list is expanded */
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

/** First 3 routes when collapsed, the full list when expanded */
const visibleRoutes = computed<RouteGroupCardRoute[]>(() =>
    expanded.value ? props.routes : props.routes.slice(0, COLLAPSED_ROUTES)
);

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
