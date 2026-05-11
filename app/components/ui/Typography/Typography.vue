<template>
    <component :is="tag" :class="variantClasses[variant]">
        <slot />
    </component>
</template>

<script setup lang="ts">
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

/** Resolved HTML tag to render */
const tag = computed((): string => props.as ?? props.variant);

/** Tailwind classes mapped to each heading variant */
const variantClasses: Record<Variant, string> = {
    h1: 'font-manrope text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-semibold text-[var(--p-surface-900)]',
    h2: 'font-manrope text-[2rem] font-semibold text-[var(--p-surface-900)]',
    h3: 'font-manrope text-[1.5rem] font-semibold text-[var(--p-surface-900)]',
    h4: 'font-manrope text-[1rem] md:text-[1.125rem] lg:text-[1.25rem] font-semibold text-[var(--p-surface-900)]',
    h5: 'font-manrope text-[1.125rem] font-semibold text-[var(--p-surface-900)]',
    h6: 'font-manrope text-[1rem] font-semibold text-[var(--p-surface-900)]'
};
</script>
