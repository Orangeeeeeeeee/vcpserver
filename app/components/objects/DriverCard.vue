<template>
    <div class="border border-surface-300 rounded-md w-full">
        <!-- Header: status + overflow menu -->
        <div class="border-b border-surface-300 px-3 pt-4 pb-3">
            <div class="flex items-start justify-between gap-2 relative mb-2">
                <Tag :severity="statusSeverity" :value="statusLabel" />
                <button
                    type="button"
                    class="inline-flex cursor-pointer p-0 text-surface-800"
                    aria-haspopup="true"
                    @click="toggleMenu"
                >
                    <Icon name="tabler:dots-vertical" class="size-5" />
                </button>
                <Menu ref="menuRef" :model="menuItems" popup>
                    <template #item="{ item, props: itemProps }">
                        <a
                            v-bind="itemProps.action"
                            :class="[
                                'flex items-center justify-between gap-6 cursor-pointer',
                                (item as DriverMenuItem).danger &&
                                    'text-red-600'
                            ]"
                        >
                            <span>{{ item.label }}</span>
                            <Icon
                                :name="(item as DriverMenuItem).icon"
                                class="size-5"
                            />
                        </a>
                    </template>
                </Menu>
            </div>

            <!-- Identity -->
            <div class="flex items-center gap-1">
                <Avatar
                    :label="driver.initials"
                    shape="circle"
                    class="font-semibold"
                />
                <div class="flex flex-col">
                    <span
                        class="font-semibold text-surface-900 truncate text-sm"
                    >
                        {{ driver.name }}
                    </span>
                    <span class="text-xs text-surface-700 truncate">
                        {{ driver.company }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Contacts -->
        <div class="p-3 flex flex-col gap-1">
            <div class="flex flex-col gap-0.5 text-sm text-surface-800">
                <div class="flex items-center gap-1">
                    <Icon
                        name="tabler:truck"
                        class="size-4 text-surface-600 shrink-0"
                    />
                    <span class="truncate">
                        {{ driver.transport }} (ID: {{ driver.transportId }})
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <Icon
                        name="tabler:phone"
                        class="size-4 text-surface-600 shrink-0"
                    />
                    <span>{{ driver.phone }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <Icon
                        name="tabler:mail"
                        class="size-4 text-surface-600 shrink-0"
                    />
                    <span class="truncate">{{ driver.email }}</span>
                </div>
            </div>

            <!-- License -->
            <div
                class="border-t border-b border-surface-200 py-2 text-sm text-surface-900"
            >
                <span class="font-semibold text-surface-950">
                    {{ labels.licenseSection }}
                </span>
                <div class="gap-1 flex flex-col">
                    <div class="flex items-center gap-2">
                        <Icon
                            name="tabler:id"
                            class="size-4 text-surface-600 shrink-0"
                        />
                        <span>{{ driver.license.id }}</span>
                    </div>
                    <div class="flex items-center gap-4 flex-wrap">
                        <div class="flex items-center gap-2">
                            <Icon
                                name="tabler:calendar"
                                class="size-4 text-surface-600 shrink-0"
                            />
                            <span>{{ driver.license.expiresAt }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon
                                name="tabler:license"
                                class="size-4 text-surface-600 shrink-0"
                            />
                            <span>{{ driver.license.categories }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer meta -->
            <div class="flex flex-col gap-1 text-sm text-surface-700">
                <p>
                    <span class="text-surface-600">
                        {{ labels.startedAtLabel }}:
                    </span>
                    <span class="font-medium text-surface-950">
                        {{ driver.startedAt }}
                    </span>
                </p>
                <p>
                    <span class="text-surface-600">
                        {{ labels.employmentLabel }}:
                    </span>
                    <span class="font-medium text-surface-950">
                        {{ driver.employment }}
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';

export type DriverStatus = 'active' | 'blocked' | 'vacation' | 'unavailable';

export interface DriverLicense {
    /** License identifier, e.g. "DL-UA-78451239" */
    id: string;
    /** Display-ready expiration date, e.g. "18.09.2027" */
    expiresAt: string;
    /** Display-ready categories, e.g. "B, C" */
    categories: string;
}

export interface DriverDocument {
    id: string;
    /** Display name, e.g. "Водійське посвідчення (скан)" */
    name: string;
    /** Captured file name (UI-only; no real file is stored) */
    fileName?: string;
}

export interface Driver {
    id: string;
    /** Full name, e.g. "Василь Прийма" */
    name: string;
    /** Two-letter initials for the avatar, e.g. "ВП" */
    initials: string;
    /** Owning company, e.g. "Logistics UA" */
    company: string;
    status: DriverStatus;
    /** Transport model, e.g. "MAN TGX 18.480" */
    transport: string;
    /** Transport identifier, e.g. "TRK-112" */
    transportId: string;
    /** Display-ready phone, e.g. "+380 67 458 29 14" */
    phone: string;
    email: string;
    license: DriverLicense;
    /** Display-ready start date, e.g. "12.04.2022" */
    startedAt: string;
    /** Display-ready employment type, e.g. "Повна зайнятість" */
    employment: string;
    /** Optional free-text comment about the driver */
    comment?: string;
    /** Optional list of attached documents */
    documents?: DriverDocument[];
}

export interface DriverCardLabels {
    statusActive: string;
    statusBlocked: string;
    statusVacation: string;
    statusUnavailable: string;
    licenseSection: string;
    startedAtLabel: string;
    employmentLabel: string;
    menuDetails: string;
    menuEdit: string;
    menuDelete: string;
}
</script>

<script setup lang="ts">
interface DriverMenuItem extends MenuItem {
    /** Tabler icon name, e.g. "tabler:pencil" */
    icon: string;
    /** When true, renders the item with red text (destructive action) */
    danger?: boolean;
}

interface DriverCardProps {
    driver: Driver;
    labels: DriverCardLabels;
}

const props = defineProps<DriverCardProps>();

const emit = defineEmits<{
    details: [driver: Driver];
    edit: [driver: Driver];
    delete: [driver: Driver];
}>();

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menuRef');

type TagSeverity = 'success' | 'danger' | 'info' | 'warn';

const STATUS_SEVERITY: Record<DriverStatus, TagSeverity> = {
    active: 'success',
    blocked: 'danger',
    vacation: 'info',
    unavailable: 'warn'
};

/** PrimeVue Tag severity derived from the driver status */
const statusSeverity = computed<TagSeverity>(
    () => STATUS_SEVERITY[props.driver.status]
);

/** Localized status label resolved from the labels prop */
const statusLabel = computed<string>(() => {
    const map: Record<DriverStatus, string> = {
        active: props.labels.statusActive,
        blocked: props.labels.statusBlocked,
        vacation: props.labels.statusVacation,
        unavailable: props.labels.statusUnavailable
    };
    return map[props.driver.status];
});

/** Toggles the overflow menu (PrimeVue popup mode) */
const toggleMenu = (event: Event): void => {
    menuRef.value?.toggle(event);
};

const menuItems = computed<DriverMenuItem[]>(() => [
    {
        label: props.labels.menuDetails,
        icon: 'tabler:arrow-up-right',
        command: (): void => emit('details', props.driver)
    },
    {
        label: props.labels.menuEdit,
        icon: 'tabler:pencil',
        command: (): void => emit('edit', props.driver)
    },
    {
        label: props.labels.menuDelete,
        icon: 'tabler:trash',
        danger: true,
        command: (): void => emit('delete', props.driver)
    }
]);
</script>
