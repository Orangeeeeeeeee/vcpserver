<template>
    <Transition :css="false" @enter="onEnter" @leave="onLeave">
        <slot />
    </Transition>
</template>

<script setup lang="ts">
import {
    collapseDurationFor,
    prefersReducedMotion,
    stopAnimationSilently
} from '~/utils/animation';

/**
 * Slide-down / slide-up transition for collapsible `v-if`/`v-show` content.
 *
 * Animates the element between zero and its natural height with the Web
 * Animations API, so the slot must render a single block-level element
 * without its own vertical margins (wrap it in a plain div if needed).
 * Duration scales with the content height (see `~/utils/animation`).
 * Honors `prefers-reduced-motion` by skipping the animation entirely.
 */

/** Currently running animation (interrupts are resumed from its position) */
let animation: Animation | null = null;

/**
 * Runs the height animation on an element.
 *
 * @param el - Element being expanded or collapsed
 * @param expand - True to slide down (enter), false to slide up (leave)
 * @param done - Vue transition callback to finish the hook
 */
const animateHeight = (
    el: Element,
    expand: boolean,
    done: () => void
): void => {
    if (!(el instanceof HTMLElement) || prefersReducedMotion()) {
        done();
        return;
    }

    // When interrupting a running animation, continue from its current state
    const interrupted = animation !== null;
    const currentHeight = interrupted
        ? el.getBoundingClientRect().height
        : null;
    const currentOpacity = interrupted
        ? Number(getComputedStyle(el).opacity)
        : null;
    stopAnimationSilently(animation);

    const naturalHeight = el.scrollHeight;
    const fromHeight = currentHeight ?? (expand ? 0 : naturalHeight);
    const toHeight = expand ? naturalHeight : 0;

    el.style.overflow = 'hidden';

    animation = el.animate(
        [
            {
                height: `${fromHeight}px`,
                opacity: currentOpacity ?? (expand ? 0 : 1)
            },
            { height: `${toHeight}px`, opacity: expand ? 1 : 0 }
        ],
        {
            duration: collapseDurationFor(toHeight - fromHeight),
            easing: 'ease'
        }
    );

    const finish = (): void => {
        el.style.overflow = '';
        animation = null;
        done();
    };

    animation.onfinish = finish;
    animation.oncancel = finish;
};

/** Enter hook — slides the content down */
const onEnter = (el: Element, done: () => void): void =>
    animateHeight(el, true, done);

/** Leave hook — slides the content up */
const onLeave = (el: Element, done: () => void): void =>
    animateHeight(el, false, done);
</script>
