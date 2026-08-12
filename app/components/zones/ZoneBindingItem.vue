<template>
    <div class="flex flex-col gap-3">
        <!-- Entity multiselect + remove button -->
        <div class="flex items-start gap-1">
            <UiMultiSelect
                v-model="ids"
                :options="options"
                option-label="label"
                option-value="value"
                display="chip"
                filter
                :placeholder="placeholder"
                class="min-w-0 flex-1"
                show-select-all
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
                    <Icon name="tabler:trash" class="size-5" />
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
    ZONE_NOTIFICATION_CHANNEL_OPTIONS,
    type ZoneNotificationColor,
    type ZoneNotificationTypeOption
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

/** Selected entity ids (bound to `row.ids`) */
const ids = defineModel<string[]>('ids', { required: true });

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

/** Chip classes per notification type accent color */
const NOTIFICATION_CHIP_CLASSES: Record<ZoneNotificationColor, string> = {
    neutral: 'bg-surface-200 text-surface-700',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600'
};

/**
 * Resolves the notification type option of a selected value.
 * @param value Selected notification type
 * @returns The matching option, or undefined for unknown values
 */
const notificationOption = (
    value: ZoneNotificationType
): ZoneNotificationTypeOption | undefined =>
    ZONE_NOTIFICATION_TYPE_OPTIONS.find((option) => option.value === value);

/**
 * Localized chip label of a selected notification type.
 * @param value Selected notification type
 * @returns The translated label (falls back to the raw value)
 */
const notificationChipLabel = (value: ZoneNotificationType): string => {
    const option = notificationOption(value);
    return option ? t(option.labelKey) : value;
};

/**
 * Accent classes of a selected notification type chip.
 * @param value Selected notification type
 * @returns Tailwind classes for the chip background / text colors
 */
const notificationChipClass = (value: ZoneNotificationType): string =>
    NOTIFICATION_CHIP_CLASSES[notificationOption(value)?.color ?? 'neutral'];
</script>
