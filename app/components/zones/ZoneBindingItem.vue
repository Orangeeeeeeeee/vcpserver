<template>
    <div class="flex flex-col gap-3">
        <!-- Entity select + remove button -->
        <div class="flex items-start gap-1">
            <Select
                v-model="id"
                :options="options"
                option-label="label"
                option-value="value"
                :placeholder="placeholder"
                class="min-w-0 flex-1"
            />
            <Button
                v-if="removable"
                type="button"
                text
                severity="secondary"
                class="shrink-0"
                :aria-label="$t('common.delete')"
                @click="emit('remove')"
            >
                <template #icon>
                    <Icon name="tabler:trash" class="size-5 text-surface-700" />
                </template>
            </Button>
        </div>

        <!-- Trigger -->
        <SelectButton
            v-model="trigger"
            :options="ZONE_TRIGGER_OPTIONS"
            option-value="value"
            :option-label="(o) => t(o.labelKey)"
            :allow-empty="false"
            size="small"
        />

        <!-- Notification types -->
        <SharedAppFormField
            name="notificationTypes"
            :label="$t('zones.create.notificationType')"
        >
            <Select
                v-model="notificationTypes"
                :options="ZONE_NOTIFICATION_TYPE_OPTIONS"
                option-value="value"
                :option-label="(o) => t(o.labelKey)"
                display="chip"
                :placeholder="$t('zones.create.notificationTypePlaceholder')"
                fluid
            ></Select>
        </SharedAppFormField>

        <!-- Notification channels -->
        <SharedAppFormField
            name="channels"
            :label="$t('zones.create.channels')"
        >
            <SelectButton
                v-model="channels"
                :options="ZONE_NOTIFICATION_CHANNEL_OPTIONS"
                option-value="value"
                :option-label="(o) => t(o.labelKey)"
                multiple
                size="small"
            />
        </SharedAppFormField>
    </div>
</template>

<script lang="ts">
import {
    ZONE_TRIGGER_OPTIONS,
    ZONE_NOTIFICATION_TYPE_OPTIONS,
    ZONE_NOTIFICATION_CHANNEL_OPTIONS
} from '~/constants/zones';
import type {
    ZoneTrigger,
    ZoneNotificationType,
    ZoneNotificationChannel
} from '~/types/zone';

/** Option of the entity (group / vehicle) multiselect */
export interface ZoneBindingOption {
    label: string;
    value: string;
}
</script>

<script setup lang="ts">
interface ZoneBindingItemProps {
    /** Options of the entity multiselect (groups or vehicles) */
    options: ZoneBindingOption[];
    /** Localized placeholder of the entity multiselect */
    placeholder: string;
    /** Shows the remove (trash) button next to the multiselect */
    removable?: boolean;
}

defineProps<ZoneBindingItemProps>();

const emit = defineEmits<{
    /** Requests removal of this row from the section */
    remove: [];
}>();

/** Selected entity id (bound to `row.id`) */
const id = defineModel<string>('id', { required: true });

/** Selected trigger (bound to `row.trigger`) */
const trigger = defineModel<ZoneTrigger>('trigger', { required: true });

/** Selected notification types (bound to `row.notificationTypes`) */
const notificationTypes = defineModel<ZoneNotificationType[]>(
    'notificationTypes',
    { required: true }
);

/** Selected notification channels (bound to `row.channels`) */
const channels = defineModel<ZoneNotificationChannel[]>('channels', {
    required: true
});

const { t } = useI18n();
</script>
