<template>
    <div>
        <slot
            v-if="titlePosition === 'top'"
            name="title"
            :expanded="expanded"
            :toggle="toggle"
        />
        <div
            class="grid transition-[grid-template-rows] duration-[250ms] ease-[ease] motion-reduce:transition-none"
            :class="expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        >
            <div class="overflow-hidden" :inert="!expanded">
                <slot />
            </div>
        </div>
        <slot
            v-if="titlePosition === 'bottom'"
            name="title"
            :expanded="expanded"
            :toggle="toggle"
        />
    </div>
</template>

<script setup lang="ts">
/**
 * Pure-CSS collapsible region: the default slot stays mounted and is
 * shown/hidden by transitioning `grid-template-rows` between 0fr and 1fr.
 * The optional `title` slot renders the trigger outside the collapsing
 * region (above or below it via `titlePosition`) and receives
 * `{ expanded, toggle }`; parents may bind `v-model:expanded` instead.
 * The collapsed body is `inert`, so its interactive content is neither
 * focusable nor exposed to assistive technologies. Honors
 * `prefers-reduced-motion` via `motion-reduce:transition-none`.
 *
 * Spacing that must disappear when collapsed (e.g. a top gap before the
 * hidden tail of a list) belongs inside the default slot, not in a parent
 * `gap-*` — the 0fr row clips only its own content.
 */

interface AnimatedHeightProps {
    /** Side of the collapsible body the `title` slot renders on */
    titlePosition?: 'top' | 'bottom';
}

withDefaults(defineProps<AnimatedHeightProps>(), { titlePosition: 'bottom' });

/** Whether the collapsible body is shown (internal state unless bound) */
const expanded = defineModel<boolean>('expanded', { default: false });

/**
 * Flips the expanded state.
 */
const toggle = (): void => {
    expanded.value = !expanded.value;
};

defineSlots<{
    /** Collapsible body — always mounted, clipped while collapsed */
    default(): unknown;
    /** Trigger area rendered outside the collapsible region */
    title?(props: { expanded: boolean; toggle: () => void }): unknown;
}>();
</script>
