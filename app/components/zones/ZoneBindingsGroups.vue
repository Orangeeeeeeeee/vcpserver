<template>
    <div
        class="flex flex-col gap-2"
    >
        <span :class="['font-medium text-surface-900', headingSizeClass]">
            {{ $t('zones.list.groups') }}
        </span>
        <div>
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
            <SharedAnimatedHeight
                v-if="hiddenChips.length"
                :expanded="expanded"
            >
                <div class="flex flex-wrap gap-1 pt-1">
                    <span
                        v-for="chip in hiddenChips"
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
            </SharedAnimatedHeight>
        </div>
    </div>
</template>

<script lang="ts">
export type HeadingSize = 'sm' | 'base' | 'lg';

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
    /** Chips always visible in the first block */
    chips: ZoneGroupChip[];
    /** Chips collapsed behind the summary-wide «Розгорнути» toggle */
    hiddenChips: ZoneGroupChip[];
    /** Whether the collapsed chip tail is shown (driven by the parent) */
    expanded?: boolean;
    /** Font size of the section heading */
    headingSize?: HeadingSize;
}

const props = defineProps<ZoneBindingsGroupsProps>();

/** Tailwind text-size class derived from the headingSize prop */
const headingSizeClass = computed<string>(() => {
    const map: Record<HeadingSize, string> = {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg'
    };
    return map[props.headingSize ?? 'base'];
});
</script>
