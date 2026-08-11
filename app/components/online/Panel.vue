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
                        :placeholder="$t('objects.online.searchPlaceholder')"
                        fluid
                    />
                </IconField>
                <OnlineFiltersPopover />
                <slot name="actions" />
            </div>

            <!-- Active filter chips -->
            <div v-if="filterChips.length">
                <div class="flex flex-wrap items-center gap-1.5">
                    <Chip
                        v-for="chip in visibleChips"
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
                        v-if="hiddenChips.length"
                        v-model="showAllChips"
                        :count="hiddenChips.length"
                    />
                </div>
                <SharedAnimatedHeight
                    v-if="hiddenChips.length"
                    v-model:expanded="showAllChips"
                >
                    <div class="flex flex-wrap items-center gap-1.5 pt-1.5">
                        <Chip
                            v-for="chip in hiddenChips"
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
                    </div>
                </SharedAnimatedHeight>
            </div>
        </div>

        <!-- Groups -->
        <div class="min-h-0 flex-1 p-4">
            <UiScrollPanel class="h-full">
                <div class="flex flex-col gap-3">
                    <OnlineGroupSection
                        v-for="group in groups"
                        :key="group.id"
                        :group="group"
                        :vehicles="vehiclesByGroup[group.id] ?? []"
                        :count="groupCounts[group.id] ?? 0"
                    />
                </div>
            </UiScrollPanel>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    useOnlineFleetContext,
    type OnlineFilterChip
} from '~/composables/useOnlineFleet';

/** Chips shown before collapsing the rest behind «+ Ще N» */
const VISIBLE_CHIPS = 3;

const {
    groups,
    groupCounts,
    vehiclesByGroup,
    searchQuery,
    filterChips,
    removeChip
} = useOnlineFleetContext();

/** Whether the collapsed chip tail is expanded */
const showAllChips = ref<boolean>(false);

/** Chips always visible in the first row */
const visibleChips = computed<OnlineFilterChip[]>(() =>
    filterChips.value.slice(0, VISIBLE_CHIPS)
);

/** Chips collapsed behind the «+ Ще N» button */
const hiddenChips = computed<OnlineFilterChip[]>(() =>
    filterChips.value.slice(VISIBLE_CHIPS)
);
</script>
