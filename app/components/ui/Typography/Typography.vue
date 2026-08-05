<template>
    <component :is="tag" v-bind="restAttrs" :class="mergedClasses">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { normalizeClass } from 'vue';
import { twMerge } from 'tailwind-merge';

/** Available heading levels */
type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface TypographyProps {
    /** Heading variant that defines styles */
    variant: Variant;
    /** Override the rendered HTML tag (defaults to variant) */
    as?: string;
}

const props = withDefaults(defineProps<TypographyProps>(), {
    as: undefined
});

// Attrs are bound manually: the incoming `class` is run through twMerge so
// consumer utilities (e.g. `text-surface-800`) replace the conflicting
// defaults instead of losing to stylesheet order.
defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

/** Resolved HTML tag to render */
const tag = computed((): string => props.as ?? props.variant);

/** Tailwind classes mapped to each heading variant */
const variantClasses: Record<Variant, string> = {
    h1: 'text-[1.5rem] md:text-[2rem] lg:text-[2.5rem]',
    h2: 'text-[2rem]',
    h3: 'text-[1.5rem]',
    h4: 'text-base md:text-[1.125rem] lg:text-[1.25rem]',
    h5: 'text-base lg:text-[1.125rem]',
    h6: 'text-[0.875rem] lg:text-[1rem]'
};

/** Forwarded attrs without `class`, which is merged separately */
const restAttrs = computed<Record<string, unknown>>(() => {
    const { class: _class, ...rest } = attrs;
    return rest;
});

/** Default + variant classes with consumer classes merged on top */
const mergedClasses = computed<string>(() =>
    twMerge(
        'font-manrope font-medium text-surface-900',
        variantClasses[props.variant],
        normalizeClass(attrs.class)
    )
);
</script>
