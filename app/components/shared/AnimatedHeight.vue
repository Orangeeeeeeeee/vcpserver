<template>
    <div ref="outer">
        <div ref="inner" v-bind="$attrs">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    collapseDurationFor,
    prefersReducedMotion,
    stopAnimationSilently
} from '~/utils/animation';

/**
 * Slide-down / slide-up wrapper for content that changes height in place
 * (e.g. «Розгорнути / Згорнути» toggles of truncated lists).
 *
 * Watches the slot content size and animates its own height between the
 * previous and the new value, so no `v-if` restructuring is required —
 * wrap the existing container and keep slicing the list as usual.
 * Attributes (incl. `class`) fall through to the inner content wrapper.
 * Duration scales with the height difference (see `~/utils/animation`).
 * Honors `prefers-reduced-motion` by skipping the animation entirely.
 */

defineOptions({ inheritAttrs: false });

const outer = ref<HTMLElement | null>(null);
const inner = ref<HTMLElement | null>(null);

/** Content height after the previous resize (null until first measured) */
let lastHeight: number | null = null;

/** Currently running height animation */
let animation: Animation | null = null;

/** Observer of the slot content size */
let observer: ResizeObserver | null = null;

/**
 * Animates the outer wrapper from the previous content height to the new
 * one; interrupted animations continue from their current position.
 *
 * @param height - New natural content height in px
 */
const onContentResize = (height: number): void => {
    const el = outer.value;
    const previous = lastHeight;
    lastHeight = height;

    if (
        !el ||
        previous === null ||
        height === previous ||
        prefersReducedMotion()
    ) {
        return;
    }

    const fromHeight = animation ? el.getBoundingClientRect().height : previous;
    stopAnimationSilently(animation);

    el.style.overflow = 'hidden';

    animation = el.animate(
        [{ height: `${fromHeight}px` }, { height: `${height}px` }],
        {
            duration: collapseDurationFor(height - fromHeight),
            easing: 'ease'
        }
    );

    const finish = (): void => {
        el.style.overflow = '';
        animation = null;
    };

    animation.onfinish = finish;
    animation.oncancel = finish;
};

onMounted(() => {
    if (!inner.value) return;
    observer = new ResizeObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        onContentResize((entry.target as HTMLElement).offsetHeight);
    });
    observer.observe(inner.value);
});

onBeforeUnmount(() => {
    observer?.disconnect();
    stopAnimationSilently(animation);
});
</script>
