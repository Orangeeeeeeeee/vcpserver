<template>
    <div class="flex flex-col gap-3">
        <label :for="inputId" class="text-sm text-surface-700">
            {{ label }}
        </label>

        <div class="flex gap-2">
            <InputText
                :id="inputId"
                v-model="state.value"
                :type="inputType ?? 'text'"
                :placeholder="addPlaceholder"
                :invalid="r$.$fields.value.$invalid"
                fluid
                @keydown.enter.prevent="onAdd"
            />
            <UiActionButton
                icon="tabler:plus"
                :label="$t('routes.list.add')"
                @click="onAdd"
            />
        </div>

        <Message
            v-if="r$.$fields.value.$errors[0]"
            severity="error"
            size="small"
            variant="simple"
        >
            {{ $t(r$.$fields.value.$errors[0]) }}
        </Message>

        <ul class="flex flex-col">
            <li
                v-for="item in model"
                :key="item.id"
                class="flex items-center gap-2 text-sm py-2 border-b border-b-[var(--p-surface-200)] last:border-none last:pb-0 first:pt-0"
                :class="item.verified ? 'text-surface-900' : 'text-surface-500'"
            >
                <span class="md:truncate" :title="item.value">{{ item.value }}</span>

                <UiActionButton
                    icon="tabler:x"
                    text
                    class="text-surface-500"
                    @click="onRemove(item.id)"
                />

                <UiActionButton
                    v-if="!item.verified"
                    icon="tabler:send"
                    severity="secondary"
                    class="ml-auto shrink-0 shadow-none lg:border-none"
                    :label="$t('common.sendPush')"
                    @click="onSendLink(item)"
                />
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

/** SSR-safe unique id linking the label to the input */
const inputId = useId();

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
