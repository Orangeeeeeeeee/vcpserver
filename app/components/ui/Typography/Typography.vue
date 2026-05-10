<template>
    <component :is="tag" :class="variantClasses[variant]">
        <slot />
    </component>
</template>

<script setup lang="ts">
type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const props = withDefaults(
    defineProps<{
        variant: Variant;
        as?: string;
    }>(),
    {
        as: undefined
    }
);

const tag = computed(() => props.as ?? props.variant);

const variantClasses: Record<Variant, string> = {
    h1: 'font-manrope text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-semibold text-[var(--p-surface-900)]',
    h2: 'font-manrope text-[2rem] font-semibold text-[var(--p-surface-900)]',
    h3: 'font-manrope text-[1.5rem] font-semibold text-[var(--p-surface-900)]',
    h4: 'font-manrope text-[1rem] md:text-[1.125rem] lg:text-[1.25rem] font-semibold text-[var(--p-surface-900)]',
    h5: 'font-manrope text-[1.125rem] font-semibold text-[var(--p-surface-900)]',
    h6: 'font-manrope text-[1rem] font-semibold text-[var(--p-surface-900)]'
};
</script>
