<template>
    <div class="flex flex-col h-full">
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
            <div
                v-if="filterChips.length"
                class="flex flex-wrap items-center gap-1.5"
            >
                <span
                    v-for="chip in shownChips"
                    :key="chip.key"
                    class="inline-flex items-center gap-1 rounded bg-surface-200 px-2 py-0.5 text-sm text-surface-800"
                >
                    {{ chip.label }}
                    <button
                        type="button"
                        class="inline-flex cursor-pointer"
                        :aria-label="$t('common.delete')"
                        @click="removeChip(chip.key)"
                    >
                        <Icon
                            name="tabler:x"
                            class="size-3.5 text-surface-600 transition-colors hover:text-surface-900"
                        />
                    </button>
                </span>
                <button
                    v-if="hiddenCount > 0"
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-0.5 rounded bg-surface-300 px-2 py-0.5 text-sm text-surface-900"
                    @click="showAllChips = !showAllChips"
                >
                    <template v-if="!showAllChips">
                        <Icon name="tabler:plus" class="size-3.5" />
                        {{ $t('objects.online.moreChips', { n: hiddenCount }) }}
                    </template>
                    <template v-else>
                        <Icon name="tabler:chevron-up" class="size-3.5" />
                    </template>
                </button>
            </div>
        </div>

        <!-- Groups -->
        <div class="min-h-0 flex-1 p-4">
            <ScrollPanel class="online-scroll h-full">
                <div class="flex flex-col gap-3 pr-2">
                    <OnlineGroupSection
                        v-for="group in groups"
                        :key="group.id"
                        :group="group"
                        :vehicles="vehiclesByGroup[group.id] ?? []"
                        :count="groupCounts[group.id] ?? 0"
                    />
                </div>
            </ScrollPanel>
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

/** Whether the chip row is fully expanded */
const showAllChips = ref<boolean>(false);

/** Chips visible in the row (first N unless expanded) */
const shownChips = computed<OnlineFilterChip[]>(() =>
    showAllChips.value
        ? filterChips.value
        : filterChips.value.slice(0, VISIBLE_CHIPS)
);

/** Number of chips collapsed behind the «+ Ще N» button */
const hiddenCount = computed<number>(() =>
    Math.max(0, filterChips.value.length - VISIBLE_CHIPS)
);
</script>

<style scoped>
/* Keep the ScrollPanel thumb always visible (PrimeVue hides it until hover) */
.online-scroll :deep(.p-scrollpanel-bar-y) {
    width: 0.375rem;
    background: var(--p-surface-300);
    border-radius: 9999px;
    opacity: 1;
    transition: background-color 0.2s;
}

.online-scroll:hover :deep(.p-scrollpanel-bar-y),
.online-scroll :deep(.p-scrollpanel-bar-y:hover) {
    background: var(--p-surface-400);
}
</style>
