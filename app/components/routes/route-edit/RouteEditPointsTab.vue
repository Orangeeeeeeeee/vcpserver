<template>
    <div class="flex flex-col gap-4">
        <template v-for="(point, index) in points" :key="point.id">
            <!-- The start has no travel time, so it spans the full width -->
            <SharedAppFormField
                v-if="point.kind === 'start'"
                :id="`routeEditPoint-${point.id}`"
                name="pointName"
                :label="pointLabel(index)"
            >
                <InputText
                    :id="`routeEditPoint-${point.id}`"
                    v-model="point.name"
                    :placeholder="$t('routes.edit.points.namePlaceholder')"
                    fluid
                />
            </SharedAppFormField>

            <div v-else class="grid grid-cols-[1fr_minmax(8rem,auto)] gap-3">
                <SharedAppFormField
                    :id="`routeEditPoint-${point.id}`"
                    name="pointName"
                    :label="pointLabel(index)"
                >
                    <InputText
                        :id="`routeEditPoint-${point.id}`"
                        v-model="point.name"
                        :placeholder="$t('routes.edit.points.namePlaceholder')"
                        fluid
                    />
                </SharedAppFormField>

                <SharedAppFormField
                    :id="`routeEditPointTime-${point.id}`"
                    name="pointTime"
                    :label="timeLabel(point)"
                >
                    <DatePicker
                        v-model="point.timeToPoint"
                        :input-id="`routeEditPointTime-${point.id}`"
                        time-only
                        show-icon
                        icon-display="input"
                        fluid
                    >
                        <template #inputicon="{ clickCallback }">
                            <Icon
                                name="tabler:chevron-down"
                                class="size-4 cursor-pointer text-surface-700"
                                @click="clickCallback"
                            />
                        </template>
                    </DatePicker>
                </SharedAppFormField>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import {
    useRouteEditFormContext,
    type RouteEditPointState
} from '~/composables/useRouteEditForm';

/**
 * «Точки маршруту» tab of the route edit dialog: in-place edits of the
 * point names and travel times. Adding, removing and relocating points is
 * out of scope of the dialog — that stays with the full route form.
 */

const { t } = useI18n();
const { points } = useRouteEditFormContext();

/**
 * Row label of a point: «Старт», «Фініш», or a numbered «Контрольна точка N»
 * / «Зупинка N» (checkpoints and stops keep independent counters).
 * @param index - Index within {@link points}.
 */
const pointLabel = (index: number): string => {
    const point = points.value[index] as RouteEditPointState;
    if (point.kind === 'start') return t('routes.create.points.start');
    if (point.kind === 'finish') return t('routes.create.points.finish');
    const isCheckpoint = point.type === 'checkpoint';
    const n = points.value
        .slice(0, index + 1)
        .filter(
            (p) =>
                p.kind === 'intermediate' &&
                (p.type === 'checkpoint') === isCheckpoint
        ).length;
    return t(
        isCheckpoint
            ? 'routes.edit.points.checkpoint'
            : 'routes.edit.points.stop',
        { n }
    );
};

/** Label of the travel-time field, matching the kind of its point */
const timeLabel = (point: RouteEditPointState): string => {
    if (point.kind === 'finish') return t('routes.create.points.timeToFinish');
    return t(
        point.type === 'stop'
            ? 'routes.edit.points.timeToStop'
            : 'routes.create.points.timeToPoint'
    );
};
</script>
