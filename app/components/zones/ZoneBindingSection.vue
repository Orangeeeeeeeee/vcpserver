<template>
    <section class="flex flex-col gap-4 p-4 pb-1">
        <div class="flex items-center justify-between gap-2">
            <h3 class="text-base font-semibold text-surface-800 flex items-center gap-1.5">
                <Icon :name="titleIcon" class="size-5 text-surface-600" />
                {{ title }}
            </h3>
            <Button
                type="button"
                severity="secondary"
                size="small"
                text
                class="py-0"
                :label="addMoreLabel"
                @click="emit('add')"
            >
                <template #icon>
                    <Icon name="tabler:plus" class="size-4" />
                </template>
            </Button>
        </div>

        <UiAnimatedList :items="rows" :get-key="(r) => r.key">
            <template #default="{ item: row, index }">
                <div :class="index < rows.length - 1 ? 'border-surface-300' : 'border-transparent'" class="border-b pb-3">
                    <h4 v-if="index > 0" class="text-sm font-medium text-surface-900 mb-3">
                        {{ addRowLabel }}
                    </h4>
                    <ZonesZoneBindingItem
                        v-model:id="row.id"
                        v-model:trigger="row.trigger"
                        v-model:notification-types="row.notificationTypes"
                        v-model:channels="row.channels"
                        :options="options"
                        :placeholder="placeholder"
                        :removable="rows.length > 1"
                        @remove="emit('remove', index)"
                    />
                </div>
            </template>
        </UiAnimatedList>
    </section>
</template>

<script setup lang="ts">
import type { ZoneBindingFormRow } from '~/composables/useZoneForm';
import type { ZoneBindingOption } from '~/components/zones/ZoneBindingItem.vue';

interface ZoneBindingSectionProps {
    /** Localized section title, e.g. «Групи транспортів» */
    title: string;
    titleIcon: string,
    /** Localized label of the «+ Додати ще» header button */
    addMoreLabel: string;
    /** Localized subheading shown before each additional row */
    addRowLabel: string;
    /** Options of the entity multiselect (groups or vehicles) */
    options: ZoneBindingOption[];
    /** Localized placeholder of the entity multiselect */
    placeholder: string;
    /** Binding rows of the section */
    rows: ZoneBindingFormRow[];
}

defineProps<ZoneBindingSectionProps>();

const emit = defineEmits<{
    /** Requests appending a new empty row */
    add: [];
    /** Requests removal of the row at the given index */
    remove: [index: number];
}>();
</script>
