<template>
    <Button :severity="severity" class="size-10 lg:size-auto">
        <Icon :name="icon" class="size-5 shrink-0" />
        <span class="hidden lg:block">{{ label }}</span>
    </Button>
</template>

<script setup lang="ts">
import type { ButtonProps } from 'primevue/button';

interface ActionButtonProps {
    /** Tabler icon name (e.g. `tabler:plus`) */
    icon: string;
    /** Button label — hidden on mobile, visible on md+ */
    label: string;
    /** PrimeVue button severity, defaults to `secondary` */
    severity?: ButtonProps['severity'];
}

withDefaults(defineProps<ActionButtonProps>(), {
    severity: 'secondary'
});
</script>
