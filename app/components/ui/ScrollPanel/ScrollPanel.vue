<template>
    <ScrollPanel
        :pt="{
            root: 'group',
            barY: 'w-1.5! rounded-full! bg-surface-300! opacity-100! transition-colors duration-200 group-hover:bg-surface-400! hover:bg-surface-400! translate-x-2'
        }"
    >
        <slot />
    </ScrollPanel>
</template>

<script setup lang="ts">
// Explicit import so the tag resolves to PrimeVue's component, not this SFC
import ScrollPanel from 'primevue/scrollpanel';
</script>
