<template>
    <PMultiSelect
        v-bind="forwardedAttrs"
        :model-value="internalValue"
        :options="internalOptions"
        :option-label="optionLabel"
        :option-value="optionValue"
        :option-disabled="optionDisabled"
        @update:model-value="onInternalUpdate"
        @filter="onFilterUpdate"
        @change="onInternalChange"
    >
        <template #[ownOptionSlot]="{ option, selected, index }">
            <span v-if="isSentinelOption(option)" class="font-medium text-primary-600">
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
            <span
                v-if="isSentinelValue(value)"
                data-ui-sentinel
                style="display:none"
                aria-hidden="true"
            />
            <template v-else>
                <!-- eslint-disable vue/attribute-hyphenation -- slot prop keys are verbatim (no camelization) -->
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
                        <template #removeicon>
                            <slot
                                name="chipicon"
                                class="p-multiselect-chip-icon"
                                :item="value"
                                :removeCallback="removeCallback"
                            >
                                <Icon
                                    name="tabler:x"
                                    class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                    @click="removeCallback"
                                />
                            </slot>
                        </template>
                    </Chip>
                </slot>
                <!-- eslint-enable vue/attribute-hyphenation -->
            </template>
        </template>

        <template #chipicon="slotProps">
            <slot name="chipicon" v-bind="slotProps">
                <Icon
                    name="tabler:x"
                    class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                    @click="slotProps.removeCallback"
                />
            </slot>
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
import PMultiSelect, {
    type MultiSelectChangeEvent
} from 'primevue/multiselect';
import Chip from 'primevue/chip';

const SELECT_ALL_VALUE = '__ui-multiselect-select-all__';
const SENTINEL_MARKER: unique symbol = Symbol('ui-multiselect-sentinel');

interface UiMultiSelectProps {
    showSelectAll?: boolean;
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
    change: [event: MultiSelectChangeEvent];
}>();

defineOptions({ inheritAttrs: false });

const model = defineModel<unknown[] | null>({ default: undefined });

const { t } = useI18n();
const attrs = useAttrs();
const slots = useSlots();

const isRecord = (option: unknown): option is Record<string, unknown> =>
    typeof option === 'object' && option !== null;

const getOptionValue = (option: unknown): unknown =>
    props.optionValue && isRecord(option) ? option[props.optionValue] : option;

const getOptionLabelText = (option: unknown): string => {
    if (typeof props.optionLabel === 'function') {
        return props.optionLabel(option);
    }
    if (props.optionLabel && isRecord(option)) {
        return String(option[props.optionLabel] ?? '');
    }
    return String(option ?? '');
};

const isOptionDisabled = (option: unknown): boolean =>
    Boolean(
        props.optionDisabled && isRecord(option) && option[props.optionDisabled]
    );

const selectAllLabelText = computed<string>(
    () => props.selectAllLabel ?? t('common.selectAll')
);

/** Current filter query typed by the user in the MultiSelect filter input. */
const filterQuery = ref<string>('');

const onFilterUpdate = (event: { originalEvent: Event; value: string }): void => {
    filterQuery.value = event.value;
};

/**
 * Real options visible to the user after applying the current filter query.
 * When no query is active, equals all options.
 */
const filteredRealOptions = computed<unknown[]>(() => {
    const all = props.options ?? [];
    const query = filterQuery.value.trim().toLowerCase();
    if (!query) return all;
    return all.filter((option) =>
        getOptionLabelText(option).toLowerCase().includes(query)
    );
});

/** Selectable (non-disabled) values from currently visible (filtered) options. */
const filteredSelectableValues = computed<unknown[]>(() =>
    filteredRealOptions.value
        .filter((option) => !isOptionDisabled(option))
        .map(getOptionValue)
);

const allSelected = computed<boolean>(() => {
    const value = model.value ?? [];
    return (
        filteredSelectableValues.value.length > 0 &&
        filteredSelectableValues.value.every((optionValue) =>
            value.includes(optionValue)
        )
    );
});

/**
 * Sentinel option object shared between `internalOptions` and `internalValue`.
 *
 * Using one computed means both arrays hold the same object reference, so
 * PrimeVue's `a === b` short-circuit in deepEquals marks the sentinel as
 * "selected" correctly even when optionValue is not set.
 *
 * When a filter query is active, the sentinel's label field is set to the
 * query text so PrimeVue's built-in filter always passes it through
 * (real options in internalOptions are already pre-filtered by us).
 */
const currentSentinel = computed<unknown>(() => {
    const dynamicLabel = filterQuery.value.trim() || selectAllLabelText.value;
    const labelKey =
        typeof props.optionLabel === 'string' ? props.optionLabel : undefined;
    if (!labelKey && !props.optionValue) return SELECT_ALL_VALUE;
    const opt: Record<string | symbol, unknown> = { [SENTINEL_MARKER]: true };
    if (labelKey) opt[labelKey] = dynamicLabel;
    if (props.optionValue) opt[props.optionValue] = SELECT_ALL_VALUE;
    return opt;
});

/**
 * Options list passed to PrimeVue MultiSelect.
 *
 * When `showSelectAll` is active:
 * - Pre-filter real options ourselves so PrimeVue's built-in filter sees an
 *   already-filtered list (no double-filtering side effects).
 * - Prepend the sentinel only when filtered results exist; omit it otherwise
 *   so PrimeVue shows the #emptyfilter slot for empty searches.
 */
const internalOptions = computed<unknown[] | undefined>(() => {
    if (!props.showSelectAll) return props.options;
    const visible = filteredRealOptions.value;
    if (visible.length === 0) return visible;
    return [currentSentinel.value, ...visible];
});

// When optionValue is set, PrimeVue compares model values as extracted primitives
// (option[optionValue]), so we must put the extracted sentinel value (SELECT_ALL_VALUE)
// into internalValue — not the sentinel object itself.
// When optionValue is not set, getOptionValue returns the object itself, which is the
// same cached reference as currentSentinel.value used in internalOptions, so
// PrimeVue's `a === b` short-circuit marks the sentinel as selected correctly.
const internalValue = computed<unknown[] | null | undefined>(() =>
    props.showSelectAll && allSelected.value
        ? [getOptionValue(currentSentinel.value), ...(model.value ?? [])]
        : model.value
);

const isSentinelOption = (option: unknown): boolean => {
    if (!props.showSelectAll) return false;
    if (isRecord(option)) return Boolean((option as Record<symbol, unknown>)[SENTINEL_MARKER]);
    return option === SELECT_ALL_VALUE;
};

const isSentinelValue = (value: unknown): boolean => {
    if (!props.showSelectAll) return false;
    if (props.optionValue) return value === SELECT_ALL_VALUE;
    if (isRecord(value)) return Boolean((value as Record<symbol, unknown>)[SENTINEL_MARKER]);
    return value === SELECT_ALL_VALUE;
};

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
        // Select all visible (filtered) options, keeping already-selected others.
        const current = model.value ?? [];
        const toAdd = filteredSelectableValues.value.filter(
            (v) => !current.includes(v)
        );
        model.value = [...current, ...toAdd];
    } else if (!hasSentinel && hadSentinel) {
        // Deselect all visible (filtered) options, keeping others.
        model.value = (model.value ?? []).filter(
            (v) => !filteredSelectableValues.value.includes(v)
        );
    } else {
        model.value = (newValue ?? []).filter(
            (value) => !isSentinelValue(value)
        );
    }
};

const onInternalChange = (event: MultiSelectChangeEvent): void => {
    emit('change', { ...event, value: model.value });
};

const forwardedAttrs = computed<Record<string, unknown>>(() => {
    const rest: Record<string, unknown> = { ...attrs };
    delete rest.onChange;
    if (props.showSelectAll) {
        delete rest['show-toggle-all'];
        rest.showToggleAll = false;
    }
    return rest;
});

const forwardedSlotNames = computed<string[]>(() =>
    Object.keys(slots).filter(
        (name) =>
            name !== 'chipicon' &&
            (!props.showSelectAll || (name !== 'option' && name !== 'chip'))
    )
);

const sanitizeSlotProps = (
    name: string,
    slotProps: Record<string, unknown>
): Record<string, unknown> => {
    if (name !== 'value' || !props.showSelectAll) {
        return slotProps;
    }
    return {
        ...slotProps,
        value: Array.isArray(slotProps.value)
            ? slotProps.value.filter((value) => !isSentinelValue(value))
            : []
    };
};

const ownOptionSlot = computed<string>(() =>
    props.showSelectAll ? 'option' : 'ui-unused-option'
);
const ownChipSlot = computed<string>(() =>
    props.showSelectAll ? 'chip' : 'ui-unused-chip'
);

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
:deep(.p-multiselect-chip-item:has(> [data-ui-sentinel])) {
    display: none;
}
</style>
