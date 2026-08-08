<template>
    <button
        :class="[
            'size-auto flex items-center justify-center font-medium leading-none py-1 px-2 lg:p-0 gap-1.5 lg:size-10 rounded-md transition duration-300 cursor-pointer',
            severityClasses.bgHover
        ]"
    >
        <div :class="['lg:hidden text-sm', severityClasses.icon]">
            <slot name="label"></slot>
        </div>
        <div :class="severityClasses.label">
            <slot name="icon"></slot>
        </div>
    </button>
</template>

<script setup lang="ts">
interface ActionCommonButtonProps {
    severity?: 'default' | 'danger';
}

interface ButtonStateClasses {
    label: string;
    icon: string;
    bgHover: string;
}

interface ComponentClasses {
    default: ButtonStateClasses;
    danger: ButtonStateClasses;
    contrast: ButtonStateClasses;
}

const classes: ComponentClasses = {
    default: {
        label: 'text-surface-900',
        icon: 'text-surface-800',
        bgHover: 'hover:bg-surface-200'
    },

    danger: {
        label: 'text-red-600',
        icon: 'text-red-500',
        bgHover: 'hover:bg-red-100'
    },
    contrast: {
        label: 'text-surface-900',
        icon: 'text-surface-800',
        bgHover: 'hover:bg-surface-300'
    }
};

const props = withDefaults(defineProps<ActionCommonButtonProps>(), {
    severity: 'default'
});

const severityClasses = computed<ButtonStateClasses>(
    () => classes[props.severity]
);
</script>
