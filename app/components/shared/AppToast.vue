<template>
    <Toast
        :position="isDesktop ? 'top-right' : 'top-center'"
        :style="{
            width: 'fit-content',
            maxWidth: 'min(25rem, calc(100vw - 2rem))'
        }"
    />
</template>

<script setup lang="ts">
/**
 * App-wide toast outlet: top-right on desktop, top-center on mobile
 * (< 768px, project convention). The inline style overrides the themed
 * fixed width (25rem token): the toast hugs its content and is capped at
 * 25rem / the viewport minus margins on narrow screens. Layouts must
 * mount this instead of the bare PrimeVue Toast.
 */

const isDesktop = useMediaQuery('(min-width: 768px)');
</script>
