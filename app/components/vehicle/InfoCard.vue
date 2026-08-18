<template>
    <div class="rounded-lg">
        <!-- Identity -->
        <div class="flex items-start gap-1 md:gap-1.5">
            <span
                v-tooltip.top="$t(meta.labelKey)"
                class="mt-1 inline-flex shrink-0"
            >
                <Icon
                    :name="meta.icon"
                    :class="meta.textClass"
                    class="size-6"
                />
            </span>
            <div class="flex min-w-0 flex-col">
                <span
                    class="font-semibold text-surface-900 md:text-lg md:leading-normal"
                >
                    {{ vehicle.name }}
                </span>
                <span class="text-sm text-surface-800">
                    ID: {{ vehicle.vehicleId }}
                </span>
            </div>

            <!-- Below lg: back to the map (✕ on tablet, map icon on mobile) -->
            <div class="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
                <UiMapAction
                    class="hidden md:inline-flex"
                    icon="tabler:x"
                    :aria-label="$t('objects.online.mapView')"
                    @click="emit('showMap')"
                />
                <UiMapAction
                    class="md:hidden"
                    icon="tabler:map"
                    :aria-label="$t('objects.online.mapView')"
                    @click="emit('showMap')"
                />
            </div>
        </div>

        <p
            v-if="vehicle.comment"
            class="mt-2 text-xs/tight md:text-sm/tight text-surface-700 md:mt-1"
        >
            {{ vehicle.comment }}
        </p>

        <Tag v-if="vehicle.passenger" class="mt-2 w-fit text-primary-600 md:self-center text-xs md:mt-3">
            <Icon name="tabler:users" class="size-3.5 text-primary-300" />
            {{ $t('objects.online.card.passengerBadge') }}
        </Tag>

        <!-- Telemetry rows -->
        <div
            class="mt-3 md:mt-1.5 flex flex-col gap-2 md:gap-1 border-t border-surface-200 pt-3 text-xs md:text-sm text-surface-800"
        >
            <div class="flex items-center justify-between gap-2">
                <span class="flex items-center gap-1 md:gap-1.5">
                    <Icon
                        name="tabler:gauge"
                        class="size-4 md-size-5 shrink-0 text-surface-600"
                    />
                    {{ vehicle.speed }}
                    {{ $t('objects.online.card.speedUnit') }}
                </span>
                <span
                    class="inline-flex items-center gap-1 rounded bg-surface-200 px-2 py-1 text-surface-700 text-xs"
                >
                    <Icon name="tabler:refresh" class="size-3 text-surface-600" />
                    {{ vehicle.updatedAgo }}
                </span>
            </div>
            <span class="flex items-center gap-1 md:gap-1.5">
                <Icon
                    name="tabler:id"
                    class="size-4 md-size-5 shrink-0 text-surface-600"
                />
                IMEI: {{ vehicle.imei }}
            </span>
            <span class="flex items-center gap-1 md:gap-1.5">
                <Icon
                    name="tabler:map-pin"
                    class="size-4 md-size-5 shrink-0 text-surface-600"
                />
                {{ vehicle.address }}
            </span>
            <span class="flex items-center gap-1 md:gap-1.5">
                <Icon
                    name="tabler:truck"
                    class="size-4 md-size-5 shrink-0 text-surface-600"
                />
                {{ $t(vehicle.typeKey) }}
            </span>
            <span class="flex items-center gap-1 md:gap-1.5">
                <Icon
                    name="tabler:user"
                    class="size-4 md-size-5 shrink-0 text-surface-600"
                />
                {{ vehicle.driver }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ONLINE_STATUS_META, type OnlineStatusMeta } from '~/constants/online';
import { useVehicleOnlineContext } from '~/composables/useVehicleOnline';

/** Identity card of the vehicle detail panel («Онлайн» tab) */

const emit = defineEmits<{
    /** Below lg: close the panel overlay and show the map */
    showMap: [];
}>();

const { vehicle } = useVehicleOnlineContext();

/** Status visuals for the identity icon and its tooltip */
const meta = computed<OnlineStatusMeta>(
    () => ONLINE_STATUS_META[vehicle.value.status]
);
</script>
