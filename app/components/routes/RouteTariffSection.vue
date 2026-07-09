<template>
    <!-- Single fare: the route is not intercity -->
    <SharedAppFormField
        v-if="!state.intercity"
        id="routeSinglePrice"
        name="singlePrice"
        :label="$t('routes.create.tariff.price')"
    >
        <InputNumber
            v-model="state.singlePrice"
            input-id="routeSinglePrice"
            :min="0"
            :max-fraction-digits="2"
            :placeholder="$t('routes.create.tariff.pricePlaceholder')"
            fluid
        />
    </SharedAppFormField>

    <!-- Intercity, but the matrix has nothing to price yet -->
    <div
        v-else-if="tariffGroups.length === 0"
        class="flex flex-col items-start gap-3 rounded-lg bg-surface-100 p-4"
    >
        <div class="flex items-start gap-2 text-sm text-surface-700">
            <Icon
                name="tabler:alert-circle"
                class="mt-0.5 size-4 shrink-0 text-surface-500"
            />
            {{ $t('routes.create.tariff.empty') }}
        </div>
        <Button
            type="button"
            severity="secondary"
            outlined
            :label="$t('routes.create.tariff.goToPoints')"
            @click="emit('goToPoints')"
        />
    </div>

    <!-- Intercity fare matrix: one section per origin point -->
    <Accordion v-else :value="['0']" multiple>
        <AccordionPanel
            v-for="(group, index) in tariffGroups"
            :key="group.from.id"
            :value="String(index)"
        >
            <AccordionHeader>
                <RoutesRoutePointChip
                    :label="group.from.label"
                    :color="tariffColor(index)"
                />
            </AccordionHeader>
            <AccordionContent>
                <div class="flex flex-col gap-4 pt-1">
                    <SharedAppFormField
                        v-for="target in group.targets"
                        :id="`routeTariff-${target.key}`"
                        :key="target.key"
                        :name="`tariff-${target.key}`"
                        :label="`${group.from.label} - ${target.to.label}`"
                    >
                        <InputNumber
                            v-model="segmentPrices[target.key]"
                            :input-id="`routeTariff-${target.key}`"
                            :min="0"
                            :max-fraction-digits="2"
                            :placeholder="
                                $t('routes.create.tariff.pricePlaceholder')
                            "
                            fluid
                        />
                    </SharedAppFormField>
                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>

<script setup lang="ts">
import { useRouteFormContext } from '~/composables/useRouteForm';
import { ROUTE_TARIFF_COLORS } from '~/constants/route-form';
import type { RoutePointColor } from '~/constants/route-form';

/**
 * «Пасажирський тариф» section body: a single fare input, the intercity
 * fare matrix, or the «add points first» placeholder. Rendered only while
 * the passenger toggle is on (the parent owns that v-if).
 */

const emit = defineEmits<{
    /** The user asked to jump to the «Точки маршруту» tab */
    goToPoints: [];
}>();

const { state, segmentPrices, tariffGroups } = useRouteFormContext();

/** Accent color of a matrix origin chip, rotated by section order */
const tariffColor = (index: number): RoutePointColor =>
    ROUTE_TARIFF_COLORS[index % ROUTE_TARIFF_COLORS.length] as RoutePointColor;
</script>
