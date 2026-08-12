<template>
    <Button :severity="severity" :outlined="outlined" class="size-10" :class="label ? 'lg:size-auto' : ''" size="small">
        <Icon :name="icon" class="size-5 shrink-0" />
        <span v-if="label" class="hidden lg:block">{{ label }}</span>
    </Button>
</template>

<script setup lang="ts">
import type { ButtonProps } from 'primevue/button';

interface ActionButtonProps {
    /** Tabler icon name (e.g. `tabler:plus`) */
    icon: string;
    /** Button label — hidden on mobile, visible on md+ */
    label?: string;
    /** PrimeVue button severity, defaults to `secondary` */
    severity?: ButtonProps['severity'];
    outlined?: ButtonProps['outlined'];
}

withDefaults(defineProps<ActionButtonProps>(), {
    severity: 'secondary',
    outlined: false,
    label: ''
});
</script>
