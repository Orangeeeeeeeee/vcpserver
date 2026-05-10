<template>
    <div
        class="flex flex-col justify-center items-stretch w-full max-w-[360px] flex-1 mx-auto"
    >
        <div>
            <div class="text-center flex flex-col mb-4 md:mb-6 lg:mb-8">
                <UiTypography variant="h1" class="mb-2 lg:mb-4">
                    {{ title }}
                </UiTypography>
                <p
                    v-for="(line, i) in subtitleLines"
                    :key="i"
                    class="text-xs md:text-sm lg:text-base text-[var(--p-surface-700)] max-w-[80%] lg:max-w-[95%] m-auto"
                >
                    {{ line }}
                </p>
            </div>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string;
    subtitle: string | string[];
}>();

const subtitleLines = computed(() =>
    Array.isArray(props.subtitle) ? props.subtitle : [props.subtitle]
);
</script>
