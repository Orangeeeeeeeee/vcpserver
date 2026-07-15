<template>
    <div
        class="flex flex-col h-full lg:border lg:border-surface-300 lg:rounded-[10px]"
    >
        <div class="p-4 flex flex-col gap-5 border-b border-surface-300">
            <div class="flex items-center gap-2">
                <IconField class="min-w-0 flex-1">
                    <InputIcon>
                        <Icon
                            name="tabler:search"
                            class="size-5 text-surface-700"
                        />
                    </InputIcon>
                    <InputText
                        v-model="searchQuery"
                        :placeholder="$t('zones.list.searchPlaceholder')"
                        fluid
                    />
                </IconField>
                <ZonesFiltersPopover />
                <slot name="actions" />
            </div>

            <!-- Active filter chips -->
            <SharedAnimatedHeight
                v-if="filterChips.length"
                class="flex flex-wrap items-center gap-1.5"
            >
                <Chip
                    v-for="chip in shownChips"
                    :key="chip.key"
                    :label="chip.label"
                    removable
                    @remove="removeChip(chip.key)"
                >
                    <template #removeicon>
                        <Icon
                            name="tabler:x"
                            class="size-3.5 cursor-pointer text-surface-600 transition-colors hover:text-surface-900"
                            :aria-label="$t('common.delete')"
                            @click="removeChip(chip.key)"
                        />
                    </template>
                </Chip>
                <OnlineChipToggle
                    v-if="hiddenCount > 0"
                    v-model="showAllChips"
                    :count="hiddenCount"
                />
            </SharedAnimatedHeight>
        </div>

        <!-- Zone cards -->
        <div class="min-h-0 flex-1 p-4">
            <UiScrollPanel class="h-full">
                <div v-if="filteredZones.length" class="flex flex-col gap-3">
                    <ZonesZoneCard
                        v-for="zone in filteredZones"
                        :key="zone.id"
                        :zone="zone"
                        :selected="selectedZoneId === zone.id"
                        @select="selectZone(zone.id)"
                        @details="navigateTo(ROUTES.ZONE_DETAIL(zone.id))"
                    />
                </div>
                <SharedTableEmpty v-else :message="$t('zones.list.empty')" />
            </UiScrollPanel>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    useZonesOverviewContext,
    type ZonesFilterChip
} from '~/composables/useZonesOverview';
import { ROUTES } from '~/constants/routes';

/** Chips shown before collapsing the rest behind «+ Ще N» */
const VISIBLE_CHIPS = 3;

const {
    filteredZones,
    searchQuery,
    filterChips,
    removeChip,
    selectedZoneId,
    selectZone
} = useZonesOverviewContext();

/** Whether the chip row is fully expanded */
const showAllChips = ref<boolean>(false);

/** Chips visible in the row (first N unless expanded) */
const shownChips = computed<ZonesFilterChip[]>(() =>
    showAllChips.value
        ? filterChips.value
        : filterChips.value.slice(0, VISIBLE_CHIPS)
);

/** Number of chips collapsed behind the «+ Ще N» button */
const hiddenCount = computed<number>(() =>
    Math.max(0, filterChips.value.length - VISIBLE_CHIPS)
);
</script>
