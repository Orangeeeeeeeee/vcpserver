<template>
    <div
        class="flex h-full flex-col lg:rounded-[10px] lg:border lg:border-surface-300"
    >
        <div class="p-4 border-b border-surface-300">
            <!-- Header: company avatar + names -->
            <div class="flex w-full justify-between items-center gap-3">
                <div
                    class="flex items-center gap-2 border-b border-surface-200 grow pb-2"
                >
                    <Avatar
                        :label="companyInitials"
                        shape="circle"
                        class="shrink-0 bg-surface-200 text-surface-800 size-8"
                    />
                    <span
                        class="min-w-0 flex-1 md:truncate text-sm font-medium text-surface-950"
                        :title="zone.companies.join(', ')"
                    >
                        {{ zone.companies.join(', ') }}
                    </span>
                </div>
                <UiMapAction
                    class="shrink-0 lg:hidden"
                    icon="tabler:map"
                    :aria-label="$t('zones.create.map.showMap')"
                    @click="emit('showMap')"
                />
            </div>

            <!-- Zone name, area badge and types -->
            <div class="flex flex-col pt-1.5">
                <div class="flex items-center gap-2">
                    <Icon
                        :name="shapeIcon"
                        class="size-5 shrink-0"
                        :style="{ color: shapeIconColor }"
                    />
                    <span
                        class="min-w-0 flex-1 md:truncate font-medium text-surface-900"
                        :title="zone.name"
                    >
                        {{ zone.name }}
                    </span>
                    <span
                        class="shrink-0 rounded px-2 py-0.5 text-sm font-medium text-surface-800"
                        :style="{
                            backgroundColor: areaBadgeBackground,
                            color: areaBadgeColor
                        }"
                    >
                        {{ $t('zones.list.area', { n: areaLabel }) }}
                    </span>
                </div>
                <span v-if="typesLabel" class="pl-7 text-sm text-surface-700">
                    {{ typesLabel }}
                </span>
            </div>
        </div>

        <!-- Scrollable body -->
        <div class="min-h-0 flex-1">
            <UiScrollPanel class="h-full">
                <ZonesZoneBindingsSummary :zone="zone" />
                <ZonesZoneStatsSection />
            </UiScrollPanel>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ZONE_SHAPE_OPTIONS, ZONE_TYPE_OPTIONS } from '~/constants/zones';
import { primitiveColors } from '~/theme/colors';

const emit = defineEmits<{
    /** Requests switching to the map view (below lg) */
    showMap: [];
}>();

const { t } = useI18n();
const { zone } = useZoneDetailContext();

/** Two-letter initials of the first owning company, e.g. "LU" */
const companyInitials = computed<string>(() => {
    const company = zone.companies[0] ?? '';
    const words = company.split(/\s+/).filter(Boolean);
    const initials =
        words.length > 1
            ? `${words[0]?.[0] ?? ''}${words[1]?.[0] ?? ''}`
            : company.slice(0, 2);
    return initials.toUpperCase();
});

/** Icon of the zone shape (polygon / rectangle / circle) */
const shapeIcon = computed<string>(
    () =>
        ZONE_SHAPE_OPTIONS.find((o) => o.value === zone.geometry.kind)?.icon ??
        'tabler:polygon'
);

/** Solid shape icon color derived from the zone color */
const shapeIconColor = computed<string>(
    () => primitiveColors[zone.color]['500']
);

/** Area badge background derived from the zone color */
const areaBadgeBackground = computed<string>(
    () => primitiveColors[zone.color]['100']
);

/** Area badge text color derived from the zone color */
const areaBadgeColor = computed<string>(
    () => primitiveColors[zone.color]['700']
);

/** Display-ready zone area, e.g. "2.4" */
const areaLabel = computed<string>(() =>
    formatZoneArea(zoneAreaKm2(zone.geometry))
);

/** Translated zone types joined with commas */
const typesLabel = computed<string>(() =>
    zone.types
        .map((type) => {
            const option = ZONE_TYPE_OPTIONS.find((o) => o.value === type);
            return option ? t(option.labelKey) : type;
        })
        .join(', ')
);
</script>
