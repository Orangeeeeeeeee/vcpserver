<template>
    <div v-if="chips.length" class="flex flex-col gap-2 p-4 pb-0">
        <span class="text-sm font-medium text-surface-900">
            {{ $t('zones.list.groups') }}
        </span>
        <div class="flex flex-wrap gap-1">
            <span
                v-for="chip in chips"
                :key="chip.key"
                class="inline-flex items-center gap-1 rounded px-2 py-1 text-xs"
                :style="{
                    backgroundColor: chip.background,
                    color: chip.color
                }"
            >
                <Icon :name="chip.icon" class="size-4 shrink-0" />
                {{ chip.name }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
/** Group binding chip of the bindings summary */
export interface ZoneGroupChip {
    key: string;
    /** Trigger icon of the binding */
    icon: string;
    /** Group display name */
    name: string;
    /** Chip background derived from the group color */
    background: string;
    /** Chip text/icon color derived from the group color */
    color: string;
}
</script>

<script setup lang="ts">
interface ZoneBindingsGroupsProps {
    /** Chips to render (pre-truncated by the parent) */
    chips: ZoneGroupChip[];
}

defineProps<ZoneBindingsGroupsProps>();
</script>
