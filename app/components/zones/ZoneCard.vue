<template>
    <div class="overflow-hidden rounded-lg border border-surface-200">
        <!-- Header (always visible; whole collapsed card) -->
        <button
            type="button"
            class="flex w-full cursor-pointer flex-col gap-1 p-4 text-left"
            :style="{ backgroundColor: headerBackground }"
            :aria-expanded="expanded"
            @click="onHeaderClick"
        >
            <div class="flex w-full items-center gap-2">
                <Icon
                    :name="
                        expanded ? 'tabler:chevron-up' : 'tabler:chevron-down'
                    "
                    class="size-5 shrink-0 text-surface-800"
                />
                <span class="min-w-0 flex-1 truncate text-sm text-surface-800">
                    {{ zone.companies.join(', ') }}
                </span>
                <span
                    class="shrink-0 rounded px-2 py-0.5 text-xs font-medium"
                    :style="{
                        backgroundColor: badgeBackground,
                        color: badgeColor
                    }"
                >
                    {{ $t('zones.list.area', { n: areaLabel }) }}
                </span>
            </div>
            <div class="flex w-full items-center gap-2">
                <Icon
                    :name="shapeIcon"
                    class="size-5 shrink-0"
                    :style="{ color: shapeIconColor }"
                />
                <span class="min-w-0 truncate font-medium text-surface-950">
                    {{ zone.name }}
                </span>
            </div>
            <span v-if="typesLabel" class="pl-7 text-sm text-surface-700">
                {{ typesLabel }}
            </span>
        </button>

        <!-- Expanded body -->
        <div v-if="expanded" class="flex flex-col gap-3 bg-surface-50 p-4">
            <ZonesZoneBindingsSummary :zone="zone" />

            <Button
                :label="$t('zones.list.details')"
                severity="secondary"
                outlined
                fluid
                @click="emit('details')"
            />
        </div>
    </div>
</template>

<script lang="ts">
import type { Zone } from '~/types/zone';
import { ZONE_SHAPE_OPTIONS, ZONE_TYPE_OPTIONS } from '~/constants/zones';
import { primitiveColors } from '~/theme/colors';
</script>

<script setup lang="ts">
interface ZoneCardProps {
    zone: Zone;
    /** True when this zone is selected on the page (expands the card) */
    selected?: boolean;
}

const props = withDefaults(defineProps<ZoneCardProps>(), {
    selected: false
});

const emit = defineEmits<{
    /** Header click — the page selects the zone (map focus) */
    select: [];
    /** «Переглянути деталі» click — the page navigates to the zone */
    details: [];
}>();

const { t } = useI18n();

/** Whether the card body is expanded */
const expanded = ref<boolean>(false);

// Selecting the zone elsewhere (e.g. a map shape click) expands the card
watch(
    () => props.selected,
    (selected) => {
        if (selected) expanded.value = true;
    }
);

/** Selects the zone and toggles the body */
const onHeaderClick = (): void => {
    emit('select');
    expanded.value = !expanded.value;
};

/** Pastel header tint derived from the zone color */
const headerBackground = computed<string>(
    () => primitiveColors[props.zone.color]['100']
);

/** Area badge / trigger badge background derived from the zone color */
const badgeBackground = computed<string>(
    () => primitiveColors[props.zone.color]['200']
);

/** Area badge / trigger badge text color derived from the zone color */
const badgeColor = computed<string>(
    () => primitiveColors[props.zone.color]['700']
);

/** Solid shape icon color derived from the zone color */
const shapeIconColor = computed<string>(
    () => primitiveColors[props.zone.color]['500']
);

/** Icon of the zone shape (polygon / rectangle / circle) */
const shapeIcon = computed<string>(
    () =>
        ZONE_SHAPE_OPTIONS.find((o) => o.value === props.zone.geometry.kind)
            ?.icon ?? 'tabler:polygon'
);

/** Display-ready zone area, e.g. "2.4" */
const areaLabel = computed<string>(() =>
    formatZoneArea(zoneAreaKm2(props.zone.geometry))
);

/** Translated zone types joined with commas */
const typesLabel = computed<string>(() =>
    props.zone.types
        .map((type) => {
            const option = ZONE_TYPE_OPTIONS.find((o) => o.value === type);
            return option ? t(option.labelKey) : type;
        })
        .join(', ')
);
</script>
