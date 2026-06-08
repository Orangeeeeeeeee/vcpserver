<template>
    <section class="flex flex-col gap-5">
        <h2 class="text-base font-semibold text-surface-900">
            {{ title }}
        </h2>
        <slot />
    </section>
</template>

<script setup lang="ts">
interface FormFieldSetProps {
    title: string;
}

defineProps<FormFieldSetProps>();
</script>
