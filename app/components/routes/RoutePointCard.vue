<template>
    <div v-if="point" class="flex flex-col gap-4">
        <!-- Role chip + remove (intermediates only) -->
        <div class="flex items-center justify-between gap-2">
            <RoutesRoutePointChip :label="chipLabel" :color="chipColor" />
            <Button
                v-if="kind === 'intermediate'"
                type="button"
                severity="danger"
                text
                rounded
                :aria-label="$t('routes.create.points.remove')"
                @click="removePoint(point.id)"
            >
                <template #icon>
                    <Icon name="tabler:trash" class="size-5" />
                </template>
            </Button>
        </div>

        <!-- Address autocomplete with the pick-on-map button inside -->
        <SharedAppFormField
            :id="`routeAddress-${point.id}`"
            name="address"
            :label="$t('routes.create.points.address')"
        >
            <div class="relative [&_.p-autocomplete-input]:pr-11">
                <AutoComplete
                    :model-value="point.address"
                    :input-id="`routeAddress-${point.id}`"
                    :suggestions="suggestions"
                    option-label="label"
                    :placeholder="
                        $t('routes.create.points.addressPlaceholder')
                    "
                    fluid
                    @update:model-value="onAddressUpdate"
                    @complete="onAddressComplete"
                    @option-select="onAddressSelect"
                />
                <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-600 transition-colors hover:text-primary-600"
                    :aria-label="$t('routes.create.points.pickOnMap')"
                    @click="onPickOnMap"
                >
                    <Icon name="tabler:map" class="size-5" />
                </button>
            </div>
        </SharedAppFormField>

        <SharedAppFormField
            :id="`routePointName-${point.id}`"
            name="pointName"
            :label="$t('routes.create.points.name')"
        >
            <InputText
                :id="`routePointName-${point.id}`"
                v-model="point.name"
                :placeholder="$t('routes.create.points.namePlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            v-if="kind === 'intermediate'"
            :id="`routePointType-${point.id}`"
            name="pointType"
            :label="$t('routes.create.points.type')"
        >
            <Select
                :id="`routePointType-${point.id}`"
                v-model="point.type"
                :options="ROUTE_POINT_TYPE_OPTIONS"
                option-value="value"
                :option-label="(o: RoutePointTypeOption) => t(o.labelKey)"
                :placeholder="$t('routes.create.points.typePlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <!-- Radius: number input + slider on one row -->
        <SharedAppFormField
            :id="`routeRadius-${point.id}`"
            name="radius"
            :label="$t('routes.create.points.radius')"
        >
            <div class="flex items-center gap-4">
                <InputNumber
                    v-model="point.radius"
                    :input-id="`routeRadius-${point.id}`"
                    :min="ROUTE_POINT_RADIUS.min"
                    :max="ROUTE_POINT_RADIUS.max"
                    :use-grouping="false"
                    class="w-28 shrink-0"
                    fluid
                />
                <Slider
                    v-model="point.radius"
                    :min="ROUTE_POINT_RADIUS.min"
                    :max="ROUTE_POINT_RADIUS.max"
                    :step="ROUTE_POINT_RADIUS.step"
                    class="flex-1"
                    :aria-label="$t('routes.create.points.radius')"
                />
            </div>
        </SharedAppFormField>

        <template v-if="kind !== 'start'">
            <label class="flex items-center gap-3 text-sm text-surface-900">
                <ToggleSwitch v-model="point.directPath" />
                {{ $t('routes.create.points.directPath') }}
            </label>

            <!-- Travel time (editable) + computed straight-line distance -->
            <div class="grid grid-cols-2 gap-4">
                <SharedAppFormField
                    :id="`routeTime-${point.id}`"
                    name="timeToPoint"
                    :label="
                        $t(
                            kind === 'finish'
                                ? 'routes.create.points.timeToFinish'
                                : 'routes.create.points.timeToPoint'
                        )
                    "
                >
                    <DatePicker
                        v-model="point.timeToPoint"
                        :input-id="`routeTime-${point.id}`"
                        time-only
                        fluid
                    />
                </SharedAppFormField>

                <div class="flex flex-col gap-1">
                    <span class="text-sm font-normal text-surface-700">
                        {{ $t('routes.create.points.distance') }}
                    </span>
                    <span
                        class="flex min-h-10 items-center text-sm text-surface-900"
                    >
                        {{ distanceLabel }}
                    </span>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useRouteFormContext } from '~/composables/useRouteForm';
import {
    ROUTE_POINT_RADIUS,
    ROUTE_POINT_TYPE_OPTIONS,
    ROUTE_START_COLOR,
    ROUTE_FINISH_COLOR,
    ROUTE_INTERMEDIATE_COLORS
} from '~/constants/route-form';
import type {
    RoutePointColor,
    RoutePointTypeOption
} from '~/constants/route-form';
import { mockRouteAddresses } from '~/mocks/routes';
import type { MockRouteAddress } from '~/mocks/routes';

/**
 * One editable point card of the «Точки маршруту» tab. Receives only the
 * point position and edits the shared form state directly (injected
 * context), so no props are mutated.
 */

interface RoutePointCardProps {
    /** Position of the point within the route */
    index: number;
}

const props = defineProps<RoutePointCardProps>();

const emit = defineEmits<{
    /** The pick-on-map mode was requested (mobile switches to the map view) */
    pickOnMap: [];
}>();

const { t } = useI18n();
const { points, pointKind, removePoint, requestPick, segmentDistanceKm } =
    useRouteFormContext();

/** Max address suggestions shown in the dropdown */
const SUGGESTION_LIMIT = 8;

/** The edited point of the shared form state */
const point = computed(() => points.value[props.index]);

const kind = computed(() => pointKind(props.index));

/** Chip text: «Старт», «Фініш» or «Проміжна точка N» */
const chipLabel = computed<string>(() => {
    if (kind.value === 'start') return t('routes.create.points.start');
    if (kind.value === 'finish') return t('routes.create.points.finish');
    return t('routes.create.points.intermediate', { n: props.index });
});

/** Chip accent: fixed for start/finish, rotated for intermediates */
const chipColor = computed<RoutePointColor>(() => {
    if (kind.value === 'start') return ROUTE_START_COLOR;
    if (kind.value === 'finish') return ROUTE_FINISH_COLOR;
    return ROUTE_INTERMEDIATE_COLORS[
        (props.index - 1) % ROUTE_INTERMEDIATE_COLORS.length
    ] as RoutePointColor;
});

/** Straight-line distance of the segment ending at this point */
const distanceLabel = computed<string>(() => {
    const km = segmentDistanceKm(props.index);
    return km === null
        ? '—'
        : t('routes.create.points.distanceValue', { n: km });
});

const suggestions = ref<MockRouteAddress[]>([]);

/**
 * AutoComplete `complete` handler: filters the mock address catalog.
 * @param {{ query: string }} event AutoComplete query event.
 */
const onAddressComplete = (event: { query: string }): void => {
    const q = event.query.trim().toLowerCase();
    const source = q
        ? mockRouteAddresses.filter((a) => a.label.toLowerCase().includes(q))
        : mockRouteAddresses;
    suggestions.value = source.slice(0, SUGGESTION_LIMIT);
};

/**
 * Free typing keeps the text but drops the location — coordinates only come
 * from a catalog pick or the map. Object values are handled by option-select.
 * @param value Typed string or the picked catalog entry.
 */
const onAddressUpdate = (value: string | MockRouteAddress): void => {
    if (typeof value !== 'string' || !point.value) return;
    point.value.address = value;
    point.value.coords = null;
};

/**
 * A catalog address was picked: stores both the label and the location.
 * @param {{ value: MockRouteAddress }} event AutoComplete selection event.
 */
const onAddressSelect = (event: { value: MockRouteAddress }): void => {
    if (!point.value) return;
    point.value.address = event.value.label;
    point.value.coords = [...event.value.coords];
};

/** Arms the pick-on-map mode and lets the parent switch to the map view */
const onPickOnMap = (): void => {
    if (!point.value) return;
    requestPick(point.value.id);
    emit('pickOnMap');
};
</script>
