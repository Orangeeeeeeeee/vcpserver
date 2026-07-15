<template>
    <div class="px-3 py-4 md:px-3.5">
        <!-- Identity -->
        <div
            class="flex items-start gap-2 border-b border-surface-200 pb-3 mb-2.5 md:gap-2.5"
        >
            <span
                v-tooltip.top="$t(meta.labelKey)"
                class="inline-flex shrink-0"
            >
                <Icon
                    :name="meta.icon"
                    :class="meta.textClass"
                    class="size-4"
                />
            </span>
            <div class="flex min-w-0 flex-col">
                <button
                    type="button"
                    class="cursor-pointer self-start max-w-full truncate text-left font-semibold text-sm md:text-base text-surface-900 transition-colors hover:text-primary-900"
                    :title="$t('objects.online.card.showOnMap')"
                    @click="requestFocus(vehicle)"
                >
                    {{ vehicle.name }}
                </button>
                <span class="text-xs md:text-sm text-surface-800">
                    ID: {{ vehicle.vehicleId }}
                </span>
            </div>
        </div>

        <!-- Telemetry -->
        <div class="mb-2 md:mb-1">
            <div
                class="flex flex-col gap-2 text-xs md:text-sm text-surface-800 mb-2 md:gap-1"
            >
                <div class="flex items-center justify-between gap-2">
                    <span class="flex items-center gap-1">
                        <Icon
                            name="tabler:gauge"
                            class="size-[1.125rem] shrink-0 text-surface-600"
                        />
                        {{ vehicle.speed }}
                        {{ $t('objects.online.card.speedUnit') }}
                    </span>
                    <span
                        class="inline-flex items-center gap-1 rounded bg-surface-200 px-2 py-0.5 text-surface-800"
                    >
                        <Icon name="tabler:refresh" class="size-3" />
                        {{ vehicle.updatedAgo }}
                    </span>
                </div>
                <span class="flex items-center gap-1">
                    <Icon
                        name="tabler:id"
                        class="size-[1.125rem] shrink-0 text-surface-600"
                    />
                    IMEI: {{ vehicle.imei }}
                </span>
                <span class="flex items-center gap-1">
                    <Icon
                        name="tabler:map-pin"
                        class="size-[1.125rem] shrink-0 text-surface-600"
                    />
                    {{ vehicle.address }}
                </span>
            </div>

            <!-- Expanded details -->
            <SharedCollapseTransition>
                <div
                    v-if="expanded"
                    class="flex flex-col gap-2 text-xs md:text-sm text-surface-800 md:gap-1"
                >
                    <span class="flex items-center gap-1">
                        <Icon
                            name="tabler:truck"
                            class="size-[1.125rem] shrink-0 text-surface-600"
                        />
                        {{ $t(vehicle.typeKey) }}
                    </span>
                    <span class="flex items-center gap-1">
                        <Icon
                            name="tabler:user"
                            class="size-[1.125rem] shrink-0 text-surface-600"
                        />
                        {{ vehicle.driver }}
                    </span>
                    <Tag
                        v-if="vehicle.passenger"
                        class="w-fit self-start text-xs"
                    >
                        <Icon name="tabler:users" class="size-3.5" />
                        {{ $t('objects.online.card.passengerBadge') }}
                    </Tag>
                    <p
                        v-if="vehicle.comment"
                        class="text-sm/tight text-surface-700"
                    >
                        {{ vehicle.comment }}
                    </p>
                </div>
            </SharedCollapseTransition>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between gap-2">
            <button
                type="button"
                class="flex cursor-pointer items-center gap-2 text-sm font-medium text-surface-800 transition-colors hover:text-surface-950"
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
                    class="size-5"
                />
            </button>
            <button
                type="button"
                class="flex cursor-pointer items-center gap-1 text-sm font-medium text-primary-900 underline-offset-2 transition-colors hover:text-primary-950"
                @click="onDetails"
            >
                {{ $t('objects.online.card.details') }}
                <Icon name="tabler:arrow-up-right" class="size-5" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { OnlineVehicle } from '~/types/online';
import { ONLINE_STATUS_META, type OnlineStatusMeta } from '~/constants/online';
import { ROUTES } from '~/constants/routes';
import { useOnlineFleetContext } from '~/composables/useOnlineFleet';

interface VehicleCardProps {
    vehicle: OnlineVehicle;
}

const props = defineProps<VehicleCardProps>();

/** Flies the map to the vehicle when its name is clicked */
const { requestFocus } = useOnlineFleetContext();

/** Whether the extra details block is expanded */
const expanded = ref<boolean>(false);

/** Status visuals for the identity icon and its tooltip */
const meta = computed<OnlineStatusMeta>(
    () => ONLINE_STATUS_META[props.vehicle.status]
);

/** Opens the vehicle detail page («Онлайн» tab) */
const onDetails = (): void => {
    void navigateTo(ROUTES.VEHICLE_DETAIL(props.vehicle.id));
};
</script>
