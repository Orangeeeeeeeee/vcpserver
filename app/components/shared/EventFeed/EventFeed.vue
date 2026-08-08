<template>
    <div class="flex flex-col">
        <div
            v-for="(item, i) in items"
            :key="item.id"
            class="relative flex gap-3 pb-5"
        >
            <!-- connector line to the next item -->
            <span
                v-if="i < items.length - 1"
                class="absolute left-[1.1875rem] top-10 bottom-0 w-px bg-surface-300"
            />
            <span
                class="z-[1] flex size-10 shrink-0 items-center justify-center rounded-md border border-surface-300"
            >
                <Icon
                    :name="item.icon"
                    :class="item.iconClass"
                    class="size-5"
                />
            </span>
            <div class="flex min-w-0 flex-col gap-0.5 pt-0.5">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="font-medium text-surface-950">
                        {{ item.title }}
                    </span>
                    <span
                        v-if="item.badge"
                        :title="item.badge.label"
                        class="inline-flex max-w-full items-center md:truncate rounded-md px-2 py-0.5 text-sm font-medium"
                        :style="{
                            background:
                                primitiveColors[item.badge.color]['100'],
                            color: primitiveColors[item.badge.color]['700']
                        }"
                    >
                        {{ item.badge.label }}
                    </span>
                </div>
                <div
                    v-if="item.duration || item.distance || item.address"
                    class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-surface-800"
                >
                    <span v-if="item.duration" class="flex items-center gap-1">
                        <Icon
                            name="tabler:clock"
                            class="size-[1.125rem] shrink-0 text-surface-600"
                        />
                        {{ item.duration }}
                    </span>
                    <span v-if="item.distance" class="flex items-center gap-1">
                        <Icon
                            name="tabler:route"
                            class="size-[1.125rem] shrink-0 text-surface-600"
                        />
                        {{ item.distance }}
                    </span>
                    <span v-if="item.address" class="flex items-center gap-1">
                        <Icon
                            name="tabler:map-pin"
                            class="size-[1.125rem] shrink-0 text-surface-600"
                        />
                        {{ item.address }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { primitiveColors } from '~/theme/colors';

/** Colored label chip next to an item title */
export interface EventFeedBadge {
    label: string;
    /** Palette accent of the chip background/text */
    color: keyof typeof primitiveColors;
}

/** One row of the vertical event feed */
export interface EventFeedItem {
    id: string;
    /** Iconify icon shown in the leading box */
    icon: string;
    /** Tailwind text color class of the icon */
    iconClass?: string;
    title: string;
    badge?: EventFeedBadge;
    /** Formatted «⏱» line, e.g. "2 г 45 хв" */
    duration?: string;
    /** Formatted «📏» line, e.g. "140 км" */
    distance?: string;
    /** «📍» line */
    address?: string;
}
</script>

<script setup lang="ts">
/**
 * Vertical feed of timeline items (icon box + connector line + title with an
 * optional badge + duration/distance/address rows). Shared between the
 * vehicle history events and the route detail points timeline.
 */

interface EventFeedProps {
    /** Feed rows in display order */
    items: EventFeedItem[];
}

defineProps<EventFeedProps>();
</script>
