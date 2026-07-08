<template>
    <AutoComplete
        v-model="searchModel"
        :suggestions="suggestions"
        option-label="name"
        :placeholder="$t('objects.online.map.searchPlaceholder')"
        :empty-search-message="$t('objects.online.map.searchEmpty')"
        complete-on-focus
        autofocus
        fluid
        class="w-52 sm:w-72"
        @complete="onSearchComplete"
        @option-select="onOptionSelect"
    >
        <template #option="{ option }">
            <div class="flex min-w-0 items-center gap-2.5">
                <span
                    class="size-2.5 shrink-0 rounded-full"
                    :style="{
                        background: ONLINE_STATUS_META[option.status].markerBg
                    }"
                />
                <div class="flex min-w-0 flex-col">
                    <span class="truncate text-sm text-surface-900">
                        {{ option.name }}
                    </span>
                    <span class="truncate text-xs text-surface-500">
                        ID: {{ option.vehicleId }} · {{ option.driver }}
                    </span>
                </div>
            </div>
        </template>
    </AutoComplete>
</template>

<script setup lang="ts">
import { ONLINE_STATUS_META } from '~/constants/online';
import type { OnlineVehicle } from '~/types/online';

/**
 * Vehicle search box of the online maps. Owns the query/suggestions state;
 * the parent owns visibility (v-if) and decides what a pick does.
 */

interface MapSearchProps {
    /** Vehicles the box searches across (name, id or driver) */
    vehicles: OnlineVehicle[];
}

const props = defineProps<MapSearchProps>();

const emit = defineEmits<{
    /** A vehicle was picked from the suggestions */
    select: [vehicle: OnlineVehicle];
}>();

/** Max results shown in the dropdown */
const SEARCH_LIMIT = 8;

/** Holds the typed string or the picked vehicle */
const searchModel = ref<string | OnlineVehicle>('');
const suggestions = ref<OnlineVehicle[]>([]);

/**
 * AutoComplete `complete` handler: fills suggestions, matching name, vehicle
 * id or driver. An empty query lists the first vehicles.
 * @param {{ query: string }} event AutoComplete query event.
 */
const onSearchComplete = (event: { query: string }): void => {
    const q = event.query.trim().toLowerCase();
    const source = q
        ? props.vehicles.filter(
              (v) =>
                  v.name.toLowerCase().includes(q) ||
                  v.vehicleId.toLowerCase().includes(q) ||
                  v.driver.toLowerCase().includes(q)
          )
        : props.vehicles;
    suggestions.value = source.slice(0, SEARCH_LIMIT);
};

/**
 * AutoComplete `option-select` handler: forwards the pick to the parent.
 * @param {{ value: OnlineVehicle }} event AutoComplete selection event.
 */
const onOptionSelect = (event: { value: OnlineVehicle }): void => {
    emit('select', event.value);
};
</script>
