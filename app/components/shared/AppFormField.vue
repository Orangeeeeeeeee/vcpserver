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
/** regle's `$errors` shape for collection fields (arrays in the form state) */
interface CollectionErrors {
    $self?: string[];
}

interface AppFormFieldProps {
    /** Field name attribute */
    name: string;
    /** Label text */
    label: string;
    /** HTML id for label association */
    id?: string;
    /**
     * Validation error i18n key(s): a single key, the `$errors` array, or
     * regle's collection-field `$errors` object ({ $self, $each }).
     * Renders one message per entry.
     */
    error?: string | string[] | CollectionErrors;
}

const props = defineProps<AppFormFieldProps>();

/** Error keys normalized to a flat array (empty when there is no error) */
const errorList = computed<string[]>(() => {
    if (!props.error) return [];
    if (typeof props.error === 'string') return [props.error];
    if (Array.isArray(props.error)) return props.error;
    return props.error.$self ?? [];
});
</script>
