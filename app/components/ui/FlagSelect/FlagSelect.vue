<template>
    <Select
        :id="inputId"
        v-model="model"
        :options="options"
        option-label="label"
        option-value="value"
        :placeholder="placeholder"
        :filter="filter"
        :filter-placeholder="filterPlaceholder"
        :invalid="invalid"
        fluid
    >
        <template #value="{ value, placeholder: ph }">
            <span v-if="selectedOption(value)" class="flex items-center gap-2">
                <Icon :name="selectedOption(value)!.flag" class="size-5" />
                <span>{{ selectedOption(value)!.label }}</span>
            </span>
            <span v-else>{{ ph }}</span>
        </template>
        <template #option="{ option }">
            <span class="flex items-center gap-2">
                <Icon :name="option.flag" class="size-5" />
                <span>{{ option.label }}</span>
            </span>
        </template>
    </Select>
</template>

<script lang="ts">
export interface FlagSelectOption {
    /** Stored value, e.g. a country or language code */
    value: string;
    /** Already-translated display label */
    label: string;
    /** Flag icon name, e.g. "custom:ua" */
    flag: string;
}
</script>

<script setup lang="ts">
interface FlagSelectProps {
    options: FlagSelectOption[];
    placeholder?: string;
    /** Enables the dropdown search input */
    filter?: boolean;
    filterPlaceholder?: string;
    invalid?: boolean;
    /** Forwarded to the underlying Select input id */
    inputId?: string;
}

const props = withDefaults(defineProps<FlagSelectProps>(), {
    placeholder: undefined,
    filter: false,
    filterPlaceholder: undefined,
    invalid: false,
    inputId: undefined
});

const model = defineModel<string | null>({ required: true });

/** Resolves the option matching the currently selected value */
const selectedOption = (value: unknown): FlagSelectOption | undefined =>
    props.options.find((o) => o.value === value);
</script>
