<template>
    <div class="h-full lg:p-0">
        <UiScrollPanel class="h-full">
            <div
                class="flex flex-col lg:border lg:border-surface-300 lg:rounded-[10px]"
            >
                <div class="px-4 pt-4 pb-5 lg:p-4">
                    <VehicleInfoCard @show-map="emit('showMap')" />
                </div>

                <Divider />

                <div class="px-4 pb-4 lg:p-4 lg:pt-0 flex flex-col gap-3.5 mt-4">
                    <VehicleDetailSection
                        :title="$t('objects.vehicles.detail.sections.stats')"
                        :rows="statsRows"
                        :collapsed-count="3"
                    />

                    <VehicleDetailSection
                        :title="
                            $t('objects.vehicles.detail.sections.telemetry')
                        "
                        :rows="detail.telemetry"
                        :collapsed-count="4"
                    />

                    <VehicleDetailSection
                        :title="
                            $t('objects.vehicles.detail.sections.additional')
                        "
                        :rows="detail.additional"
                        :collapsed-count="3"
                    />
                </div>
            </div>
        </UiScrollPanel>
    </div>
</template>

<script setup lang="ts">
import type { OnlineDetailEntry } from '~/types/online';
import { useVehicleOnlineContext } from '~/composables/useVehicleOnline';
import Divider from 'primevue/divider';

/** Left panel of the vehicle detail page: identity card + detail sections */

const emit = defineEmits<{
    /** Below lg: close the panel overlay and show the map */
    showMap: [];
}>();

const { t } = useI18n();
const { detail } = useVehicleOnlineContext();

/** Day stats as label→value rows (fixed labels come from i18n) */
const statsRows = computed<OnlineDetailEntry[]>(() => [
    {
        label: t('objects.vehicles.detail.stats.ignitionTime'),
        value: detail.value.stats.ignitionTime
    },
    {
        label: t('objects.vehicles.detail.stats.idleTime'),
        value: detail.value.stats.idleTime
    },
    {
        label: t('objects.vehicles.detail.stats.departureTime'),
        value: detail.value.stats.departureTime
    },
    {
        label: t('objects.vehicles.detail.stats.arrivalTime'),
        value: detail.value.stats.arrivalTime ?? '—'
    },
    {
        label: t('objects.vehicles.detail.stats.mileage'),
        value: `${detail.value.stats.mileageKm} ${t('objects.vehicles.detail.stats.mileageUnit')}`
    },
    {
        label: t('objects.vehicles.detail.stats.maxSpeed'),
        value: `${detail.value.stats.maxSpeed} ${t('objects.online.card.speedUnit')}`
    }
]);
</script>
