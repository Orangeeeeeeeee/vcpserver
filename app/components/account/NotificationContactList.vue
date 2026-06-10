<template>
    <div class="flex flex-col gap-3">
        <label class="text-sm text-surface-700">{{ label }}</label>

        <div class="flex gap-2">
            <InputText
                v-model="state.value"
                :type="inputType ?? 'text'"
                :placeholder="addPlaceholder"
                :invalid="r$.$fields.value.$invalid"
                fluid
                @keydown.enter.prevent="onAdd"
            />
            <Button
                type="button"
                size="small"
                severity="secondary"
                class="shrink-0"
                @click="onAdd"
            >
                <template #icon>
                    <Icon name="tabler:plus" class="size-5" />
                </template>
            </Button>
        </div>

        <Message
            v-if="r$.$fields.value.$errors[0]"
            severity="error"
            size="small"
            variant="simple"
        >
            {{ $t(r$.$fields.value.$errors[0]) }}
        </Message>

        <ul class="flex flex-col gap-2">
            <li
                v-for="item in model"
                :key="item.id"
                class="flex items-center gap-2 text-sm py-4 border-b border-b-[var(--p-surface-200)] last:border-none"
                :class="item.verified ? 'text-surface-900' : 'text-surface-500'"
            >
                <span class="truncate">{{ item.value }}</span>
                <button
                    type="button"
                    class="cursor-pointer text-surface-500 transition-colors hover:text-surface-900"
                    :aria-label="$t('common.delete')"
                    @click="onRemove(item.id)"
                >
                    <Icon name="tabler:x" class="size-5" />
                </button>

                <Button
                    v-if="!item.verified"
                    type="button"
                    size="small"
                    severity="secondary"
                    class="shrink-0 ml-auto"
                    @click="onSendLink(item)"
                >
                    <template #icon>
                        <Icon name="tabler:send" class="size-5" />
                    </template>
                </Button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import { useToast } from 'primevue/usetoast';
import type { NotificationContact } from '~/composables/useAccountSettings';

interface NotificationContactListProps {
    /** Label shown above the input */
    label: string;
    /** Placeholder for the add input */
    addPlaceholder: string;
    /** Validation strategy for the new value */
    validator: 'email' | 'phone';
    /** Optional HTML input type (email, tel, text) */
    inputType?: string;
}

const props = defineProps<NotificationContactListProps>();
const model = defineModel<NotificationContact[]>({ required: true });

const { t } = useI18n();
const toast = useToast();

const state = reactive({ value: '' });

const rules =
    props.validator === 'email'
        ? {
              value: {
                  required: withMessage(required, 'validation.required'),
                  ...emailRules()
              }
          }
        : {
              value: { required: withMessage(required, 'validation.required') }
          };

const { r$ } = useRegle(state, rules, { lazy: true });

/** Validates the input and appends a new pending contact to the list */
const onAdd = async (): Promise<void> => {
    const { valid } = await r$.$validate();
    if (valid) {
        model.value = [
            ...model.value,
            {
                id: crypto.randomUUID(),
                value: state.value.trim(),
                verified: false
            }
        ];
        state.value = '';
        r$.$reset();
    }
};

/** Removes the contact with the given id from the list */
const onRemove = (id: string): void => {
    model.value = model.value.filter((item) => item.id !== id);
};

/** Shows a mock toast for the "send verification link" action */
const onSendLink = (item: NotificationContact): void => {
    toast.add({
        severity: 'success',
        summary: t('account.settings.linkSent'),
        detail: item.value,
        life: 3000
    });
};
</script>
