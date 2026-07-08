<template>
    <div v-if="rows.length" class="p-4 pb-0 border-t border-surface-300">
        <!-- Individual vehicle bindings -->
        <div class="flex flex-col gap-2">
            <span class="text-sm font-medium text-surface-900">
                {{ $t('zones.list.singleVehicles') }}
            </span>
            <div
                v-for="row in rows"
                :key="row.key"
                class="flex items-start gap-3 border-b border-surface-200 pb-2"
            >
                <span
                    class="flex h-6 px-1.5 shrink-0 items-center justify-center rounded"
                    :style="{
                        backgroundColor: badgeBackground,
                        color: badgeColor
                    }"
                >
                    <Icon :name="row.icon" class="size-4" />
                </span>
                <div class="flex min-w-0 flex-col gap-1">
                    <span
                        class="flex items-center gap-1 text-sm text-surface-900"
                    >
                        <Icon
                            name="tabler:truck"
                            class="size-4.5 shrink-0 text-surface-600"
                        />
                        {{ row.label }}
                    </span>
                    <span
                        class="flex items-center gap-1 text-sm text-surface-900"
                    >
                        <Icon
                            name="tabler:user"
                            class="size-4.5 shrink-0 text-surface-600"
                        />
                        {{ row.driverName ?? '—' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Expand / collapse the truncated lists -->
        <button
            v-if="expandable"
            type="button"
            class="w-full p-4 pb-0 flex cursor-pointer items-center justify-center gap-2 self-center text-sm text-surface-700 transition-colors hover:text-surface-900"
            @click="expanded = !expanded"
        >
            {{ expanded ? $t('zones.list.collapse') : $t('zones.list.expand') }}
            <Icon
                :name="expanded ? 'tabler:chevron-up' : 'tabler:chevron-down'"
                class="size-5"
            />
        </button>
    </div>
</template>

<script lang="ts">
import type { ZoneColor } from '~/types/zone';
import { primitiveColors } from '~/theme/colors';

/** Individual vehicle row of the bindings summary */
export interface ZoneVehicleRow {
    key: string;
    /** Trigger icon of the binding */
    icon: string;
    /** Vehicle label, e.g. "MAN TGX 18.480 (ID: TRK-112)" */
    label: string;
    /** Assigned driver name; null when the vehicle has no driver */
    driverName: string | null;
}
</script>

<script setup lang="ts">
interface ZoneBindingsVehiclesProps {
    /** Rows to render (pre-truncated by the parent) */
    rows: ZoneVehicleRow[];
    /** Zone accent color the trigger badge palette derives from */
    zoneColor: ZoneColor;
    /** Shows the «Розгорнути / Згорнути» toggle under the rows */
    expandable?: boolean;
}

const props = defineProps<ZoneBindingsVehiclesProps>();

/** Whether the truncated summary lists are fully shown (bound to the parent) */
const expanded = defineModel<boolean>('expanded', { required: true });

/** Trigger badge background derived from the zone color */
const badgeBackground = computed<string>(
    () => primitiveColors[props.zoneColor]['200']
);

/** Trigger badge text color derived from the zone color */
const badgeColor = computed<string>(
    () => primitiveColors[props.zoneColor]['700']
);
</script>
