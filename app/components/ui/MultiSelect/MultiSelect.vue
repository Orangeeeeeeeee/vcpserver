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

const sentinelOption = computed<unknown>(() => {
    const labelKey =
        typeof props.optionLabel === 'string' ? props.optionLabel : undefined;
    if (!labelKey && !props.optionValue) return SELECT_ALL_VALUE;
    const option: Record<string | symbol, unknown> = {
        [SENTINEL_MARKER]: true
    };
    if (labelKey) option[labelKey] = selectAllLabelText.value;
    if (props.optionValue) option[props.optionValue] = SELECT_ALL_VALUE;
    return option;
});

const sentinelValue = computed<unknown>(() =>
    getOptionValue(sentinelOption.value)
);

const selectableValues = computed<unknown[]>(() =>
    (props.options ?? [])
        .filter((option) => !isOptionDisabled(option))
        .map(getOptionValue)
);

const allSelected = computed<boolean>(() => {
    const value = model.value ?? [];
    return (
        selectableValues.value.length > 0 &&
        selectableValues.value.every((optionValue) =>
            value.includes(optionValue)
        )
    );
});

const internalOptions = computed<unknown[] | undefined>(() => {
    const options = props.options ?? [];
    return props.showSelectAll && options.length > 0
        ? [sentinelOption.value, ...options]
        : props.options;
});

const internalValue = computed<unknown[] | null | undefined>(() =>
    props.showSelectAll && allSelected.value
        ? [sentinelValue.value, ...(model.value ?? [])]
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
        model.value = [...selectableValues.value];
    } else if (!hasSentinel && hadSentinel) {
        model.value = [];
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
