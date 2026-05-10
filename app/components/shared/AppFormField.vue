<template>
    <FormField
        v-slot="$field"
        :name="name"
        :validate-on-blur="false"
        :validate-on-value-update="false"
        class="flex flex-col gap-1.5"
    >
        <label
            :for="id"
            class="text-sm font-normal text-[var(--p-surface-700)]"
        >
            {{ label }}
        </label>
        <slot :field="$field" />
        <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple"
        >
            {{ $t($field.error?.message) }}
        </Message>
    </FormField>
</template>

<script setup lang="ts">
import { FormField } from '@primevue/forms';

defineProps<{
    name: string;
    label: string;
    id?: string;
}>();
</script>
