<template>
    <InputText
        v-bind="$attrs"
        :model-value="display"
        @update:model-value="onUpdate"
    />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

interface UiInputNumberProps {
    /** Value to emit when the field is cleared. Defaults to null. */
    fallback?: number | null;
}

const props = withDefaults(defineProps<UiInputNumberProps>(), {
    fallback: null,
});

const model = defineModel<number | null>({ default: null });

/** Internal string shown in the input. Updated by user input and external model changes. */
const display = ref<string>(Number.isFinite(model.value) ? String(model.value) : '');

// Sync display when the model is changed externally (e.g. form reset / load).
// Does not fire when the user is typing invalid chars (model stays unchanged → no trigger).
watch(model, (val) => {
    display.value = Number.isFinite(val) ? String(val) : '';
});

/** Accepts any typed string; only pushes numeric (or empty) values to the model. */
const onUpdate = (v: string): void => {
    display.value = v;
    const trimmed = v.trim();
    if (trimmed === '') {
        model.value = props.fallback;
        return;
    }
    const n = Number(trimmed);
    if (Number.isFinite(n)) {
        model.value = n;
    }
    // Non-numeric input: display updated, model intentionally left unchanged.
};
</script>
