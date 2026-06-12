<template>
    <div class="flex flex-col gap-2 px-3 py-3">
        <!-- Identity -->
        <div class="flex items-start gap-2">
            <span
                v-tooltip.top="$t(meta.labelKey)"
                class="mt-0.5 inline-flex shrink-0"
            >
                <Icon
                    :name="meta.icon"
                    :class="meta.textClass"
                    class="size-5"
                />
            </span>
            <div class="flex min-w-0 flex-col">
                <span class="font-semibold text-sm text-surface-950 truncate">
                    {{ vehicle.name }}
                </span>
                <span class="text-xs text-surface-700">
                    ID: {{ vehicle.vehicleId }}
                </span>
            </div>
        </div>

        <!-- Telemetry -->
        <div class="flex flex-col gap-1 text-sm text-surface-800">
            <div class="flex items-center justify-between gap-2">
                <span class="flex items-center gap-1.5">
                    <Icon
                        name="tabler:gauge"
                        class="size-4 shrink-0 text-surface-600"
                    />
                    {{ vehicle.speed }} {{ $t('objects.online.card.speedUnit') }}
                </span>
                <span
                    class="inline-flex items-center gap-1 rounded bg-surface-200 px-2 py-0.5 text-xs text-surface-800"
                >
                    <Icon name="tabler:refresh" class="size-3.5" />
                    {{ vehicle.updatedAgo }}
                </span>
            </div>
            <span class="flex items-center gap-1.5">
                <Icon
                    name="tabler:id"
                    class="size-4 shrink-0 text-surface-600"
                />
                IMEI: {{ vehicle.imei }}
            </span>
            <span class="flex items-start gap-1.5">
                <Icon
                    name="tabler:map-pin"
                    class="mt-0.5 size-4 shrink-0 text-surface-600"
                />
                {{ vehicle.address }}
            </span>
        </div>

        <!-- Expanded details -->
        <div
            v-if="expanded"
            class="flex flex-col gap-1.5 text-sm text-surface-800"
        >
            <span class="flex items-center gap-1.5">
                <Icon
                    name="tabler:truck"
                    class="size-4 shrink-0 text-surface-600"
                />
                {{ $t(vehicle.typeKey) }}
            </span>
            <span class="flex items-center gap-1.5">
                <Icon
                    name="tabler:user"
                    class="size-4 shrink-0 text-surface-600"
                />
                {{ vehicle.driver }}
            </span>
            <span
                v-if="vehicle.passenger"
                class="inline-flex w-fit items-center gap-1 rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-700"
            >
                <Icon name="tabler:users" class="size-3.5" />
                {{ $t('objects.online.card.passengerBadge') }}
            </span>
            <p v-if="vehicle.comment" class="text-sm/tight text-surface-700">
                {{ vehicle.comment }}
            </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between gap-2">
            <button
                type="button"
                class="flex cursor-pointer items-center gap-1 text-sm font-medium text-surface-800 transition-colors hover:text-surface-950"
                @click="expanded = !expanded"
            >
                {{
                    expanded
                        ? $t('objects.online.card.collapse')
                        : $t('objects.online.card.expand')
                }}
                <Icon
                    :name="
                        expanded ? 'tabler:chevron-up' : 'tabler:chevron-down'
                    "
                    class="size-4"
                />
            </button>
            <button
                type="button"
                class="flex cursor-pointer items-center gap-1 text-sm font-semibold text-primary-700 underline-offset-2 transition-colors hover:text-primary-900"
                @click="onDetails"
            >
                {{ $t('objects.online.card.details') }}
                <Icon name="tabler:arrow-up-right" class="size-4" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { OnlineVehicle } from '~/types/online';
import {
    ONLINE_STATUS_META,
    type OnlineStatusMeta
} from '~/constants/online';

interface VehicleCardProps {
    vehicle: OnlineVehicle;
}

const props = defineProps<VehicleCardProps>();

const { t } = useI18n();
const toast = useToast();

/** Whether the extra details block is expanded */
const expanded = ref<boolean>(false);

/** Status visuals for the identity icon and its tooltip */
const meta = computed<OnlineStatusMeta>(
    () => ONLINE_STATUS_META[props.vehicle.status]
);

/** The vehicle-online detail page does not exist yet */
const onDetails = (): void => {
    toast.add({
        severity: 'info',
        summary: t('common.inDevelopment'),
        life: 2000
    });
};
</script>
