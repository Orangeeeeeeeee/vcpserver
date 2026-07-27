<template>
    <PMultiSelect
        v-bind="forwardedAttrs"
        :model-value="internalValue"
        :options="internalOptions"
        :option-label="optionLabel"
        :option-value="optionValue"
        :option-disabled="optionDisabled"
        @update:model-value="onInternalUpdate"
        @change="onInternalChange"
    >
        <template #[ownOptionSlot]="{ option, selected, index }">
            <span v-if="isSentinelOption(option)" class="font-medium">
                {{ selectAllLabelText }}
            </span>
            <slot
                v-else
                name="option"
                :option="option"
                :selected="selected"
                :index="index"
            >
                <span>{{ getOptionLabelText(option) }}</span>
            </slot>
        </template>

        <template #[ownChipSlot]="{ value, removeCallback }">
            <template v-if="!isSentinelValue(value)">
                <!-- eslint-disable vue/attribute-hyphenation -- Vue passes slot prop keys verbatim (no camelization), so they must stay camelCase to match PrimeVue's #chip/#chipicon API -->
                <slot
                    name="chip"
                    :value="value"
                    :removeCallback="removeCallback"
                >
                    <Chip
                        class="p-multiselect-chip"
                        :label="getLabelByValue(value)"
                        removable
                        @remove="removeCallback($event)"
                    >
                        <template v-if="$slots.chipicon" #removeicon>
                            <slot
                                name="chipicon"
                                class="p-multiselect-chip-icon"
                                :item="value"
                                :removeCallback="removeCallback"
                            />
                        </template>
                    </Chip>
                </slot>
                <!-- eslint-enable vue/attribute-hyphenation -->
            </template>
        </template>

        <template
            v-for="name in forwardedSlotNames"
            :key="name"
            #[name]="slotProps"
        >
            <slot :name="name" v-bind="sanitizeSlotProps(name, slotProps)" />
        </template>
    </PMultiSelect>
</template>

<script setup lang="ts">
// PrimeVue MultiSelect must be imported under an alias: a bare <MultiSelect>
// tag inside a file named MultiSelect.vue resolves to the SFC itself
// (implicit self-reference) and recurses infinitely.
import PMultiSelect, {
    type MultiSelectChangeEvent
} from 'primevue/multiselect';
import Chip from 'primevue/chip';

/**
 * Wrapper around PrimeVue MultiSelect that injects a synthetic «Select all»
 * option as the first list row when `showSelectAll` is enabled.
 *
 * The synthetic option never leaves the wrapper: it is appended to the
 * internal model only while every selectable option is selected (so its row
 * checkbox reflects the state) and is stripped from every outgoing value,
 * therefore the external v-model never contains the sentinel.
 *
 * Limitations with `showSelectAll`:
 * - primitive model values only (membership is checked with `includes`);
 * - option groups and a function `optionLabel` are not supported;
 * - use `display="chip"` or a custom `#value` template (its `value` slot
 *   prop is forwarded sentinel-free); the built-in `display="comma"` text
 *   label would include the select-all caption when everything is selected;
 * - do not combine with `maxSelectedLabels` (the sentinel affects the count);
 * - while filtering, the select-all row is filtered out like any other
 *   option; toggling always applies to all options, not the visible subset.
 */

/** Internal marker used as the select-all option value; never leaves the wrapper */
const SELECT_ALL_VALUE = '__ui-multiselect-select-all__';

interface UiMultiSelectProps {
    /** Renders the synthetic «Select all» row on top of the option list */
    showSelectAll?: boolean;
    /** Caption of the select-all row; defaults to the `common.selectAll` translation */
    selectAllLabel?: string;
    options?: unknown[];
    optionLabel?: string | ((option: unknown) => string);
    optionValue?: string;
    optionDisabled?: string;
}

const props = withDefaults(defineProps<UiMultiSelectProps>(), {
    showSelectAll: false,
    selectAllLabel: undefined,
    options: undefined,
    optionLabel: undefined,
    optionValue: undefined,
    optionDisabled: undefined
});

const emit = defineEmits<{
    /** PrimeVue change event re-emitted with the sentinel stripped from the value */
    change: [event: MultiSelectChangeEvent];
}>();

defineOptions({ inheritAttrs: false });

const model = defineModel<unknown[] | null>({ default: undefined });

const { t } = useI18n();
const attrs = useAttrs();
const slots = useSlots();

/** Narrows an option to a plain object */
const isRecord = (option: unknown): option is Record<string, unknown> =>
    typeof option === 'object' && option !== null;

/**
 * Extracts the model value of an option (mirrors PrimeVue `optionValue`).
 *
 * @param option - Option to read the value from
 * @returns The option value used in the model
 */
const getOptionValue = (option: unknown): unknown =>
    props.optionValue && isRecord(option) ? option[props.optionValue] : option;

/**
 * Resolves the display label of an option (mirrors PrimeVue `optionLabel`).
 *
 * @param option - Option to read the label from
 * @returns The human-readable option label
 */
const getOptionLabelText = (option: unknown): string => {
    if (typeof props.optionLabel === 'function') {
        return props.optionLabel(option);
    }
    if (props.optionLabel && isRecord(option)) {
        return String(option[props.optionLabel] ?? '');
    }
    return String(option ?? '');
};

/** Whether the option is excluded from selection (mirrors PrimeVue `optionDisabled`) */
const isOptionDisabled = (option: unknown): boolean =>
    Boolean(
        props.optionDisabled && isRecord(option) && option[props.optionDisabled]
    );

/** Resolved caption of the select-all row */
const selectAllLabelText = computed<string>(
    () => props.selectAllLabel ?? t('common.selectAll')
);

/** Synthetic select-all option shaped after the configured option keys */
const sentinelOption = computed<unknown>(() => {
    const labelKey =
        typeof props.optionLabel === 'string' ? props.optionLabel : undefined;
    if (!labelKey && !props.optionValue) return SELECT_ALL_VALUE;
    const option: Record<string, unknown> = {};
    if (labelKey) option[labelKey] = selectAllLabelText.value;
    if (props.optionValue) option[props.optionValue] = SELECT_ALL_VALUE;
    return option;
});

/** Model value representing the select-all option */
const sentinelValue = computed<unknown>(() =>
    getOptionValue(sentinelOption.value)
);

/** Values of all selectable (non-disabled) real options */
const selectableValues = computed<unknown[]>(() =>
    (props.options ?? [])
        .filter((option) => !isOptionDisabled(option))
        .map(getOptionValue)
);

/** Whether every selectable option is present in the external model */
const allSelected = computed<boolean>(() => {
    const value = model.value ?? [];
    return (
        selectableValues.value.length > 0 &&
        selectableValues.value.every((optionValue) =>
            value.includes(optionValue)
        )
    );
});

/**
 * Options passed down, with the select-all row prepended when enabled.
 * With no real options the sentinel is omitted so the built-in empty
 * message still renders.
 */
const internalOptions = computed<unknown[] | undefined>(() => {
    const options = props.options ?? [];
    return props.showSelectAll && options.length > 0
        ? [sentinelOption.value, ...options]
        : props.options;
});

/** Model passed down: the external model plus the sentinel when everything is selected */
const internalValue = computed<unknown[] | null | undefined>(() =>
    props.showSelectAll && allSelected.value
        ? [sentinelValue.value, ...(model.value ?? [])]
        : model.value
);

/** Whether the given option is the synthetic select-all option */
const isSentinelOption = (option: unknown): boolean =>
    props.showSelectAll && option === sentinelOption.value;

/** Whether the given model value belongs to the synthetic select-all option */
const isSentinelValue = (value: unknown): boolean =>
    props.showSelectAll && value === sentinelValue.value;

/**
 * Translates model updates of the underlying MultiSelect into the external
 * model: the sentinel appearing in the value selects every option, the
 * sentinel disappearing clears the selection, any other update is forwarded
 * with the sentinel stripped. Covers both mouse and keyboard toggling.
 *
 * @param newValue - Raw model value emitted by the underlying MultiSelect
 */
const onInternalUpdate = (newValue: unknown[] | null | undefined): void => {
    if (!props.showSelectAll) {
        model.value = newValue ?? null;
        return;
    }
    const hadSentinel = allSelected.value;
    const hasSentinel = Array.isArray(newValue)
        ? newValue.some(isSentinelValue)
        : false;
    if (hasSentinel && !hadSentinel) {
        model.value = [...selectableValues.value];
    } else if (!hasSentinel && hadSentinel) {
        model.value = [];
    } else {
        model.value = (newValue ?? []).filter(
            (value) => !isSentinelValue(value)
        );
    }
};

/**
 * Re-emits the PrimeVue change event with a sanitized value. The external
 * model is already updated at this point (PrimeVue writes the value before
 * emitting change), so it is used as the payload instead of the raw value
 * that may contain the sentinel.
 *
 * @param event - Original PrimeVue change event
 */
const onInternalChange = (event: MultiSelectChangeEvent): void => {
    emit('change', { ...event, value: model.value });
};

/**
 * Attributes forwarded to the underlying MultiSelect. `onChange` is held
 * back (a sanitized `change` is re-emitted instead) and the built-in header
 * toggle-all checkbox is forced off when the select-all row is shown.
 */
const forwardedAttrs = computed<Record<string, unknown>>(() => {
    const rest: Record<string, unknown> = { ...attrs };
    delete rest.onChange;
    if (props.showSelectAll) {
        delete rest['show-toggle-all'];
        rest.showToggleAll = false;
    }
    return rest;
});

/** Parent slot names passed through (the wrapper owns option/chip while select-all is on) */
const forwardedSlotNames = computed<string[]>(() =>
    Object.keys(slots).filter(
        (name) => !props.showSelectAll || (name !== 'option' && name !== 'chip')
    )
);

/**
 * Strips the sentinel from the `value` slot props before forwarding, so a
 * parent `#value` template never sees the synthetic select-all entry.
 *
 * @param name - Forwarded slot name
 * @param slotProps - Slot props emitted by the underlying MultiSelect
 * @returns Slot props safe to expose to the parent
 */
const sanitizeSlotProps = (
    name: string,
    slotProps: Record<string, unknown>
): Record<string, unknown> => {
    if (
        name !== 'value' ||
        !props.showSelectAll ||
        !Array.isArray(slotProps.value)
    ) {
        return slotProps;
    }
    return {
        ...slotProps,
        value: slotProps.value.filter((value) => !isSentinelValue(value))
    };
};

/** Wrapper-owned slot names; swapped to inert names when select-all is off so the wrapper stays transparent */
const ownOptionSlot = computed<string>(() =>
    props.showSelectAll ? 'option' : 'ui-unused-option'
);
const ownChipSlot = computed<string>(() =>
    props.showSelectAll ? 'chip' : 'ui-unused-chip'
);

/**
 * Resolves the chip label for a model value (mirrors PrimeVue
 * `getLabelByValue`).
 *
 * @param value - Model value to look up
 * @returns Label of the matching option, or the stringified value
 */
const getLabelByValue = (value: unknown): string => {
    const option = (props.options ?? []).find(
        (candidate) => getOptionValue(candidate) === value
    );
    return option !== undefined
        ? getOptionLabelText(option)
        : String(value ?? '');
};
</script>

<style scoped>
/* The hidden select-all chip still renders an empty chip-item wrapper span;
   without this the label flex gap produces a stray double gap. Unlayered
   :deep() so it wins over @layer primevue. */
:deep(.p-multiselect-chip-item:empty) {
    display: none;
}
</style>
