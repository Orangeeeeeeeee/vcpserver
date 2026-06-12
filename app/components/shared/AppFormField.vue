<template>
    <div class="flex flex-col gap-1">
        <label :for="id" class="text-sm font-normal text-surface-700">
            {{ label }}
        </label>
        <slot />
        <Message
            v-for="message in errorList"
            :key="message"
            severity="error"
            size="small"
            variant="simple"
        >
            {{ $t(message) }}
        </Message>
    </div>
</template>

<script setup lang="ts">
interface AppFormFieldProps {
    /** Field name attribute */
    name: string;
    /** Label text */
    label: string;
    /** HTML id for label association */
    id?: string;
    /** Validation error i18n key(s); arrays render one message per entry */
    error?: string | string[];
}

const props = defineProps<AppFormFieldProps>();

/** Error keys normalized to an array (empty when there is no error) */
const errorList = computed<string[]>(() => {
    if (!props.error) return [];
    return Array.isArray(props.error) ? props.error : [props.error];
});
</script>
