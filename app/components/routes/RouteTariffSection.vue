<template>
    <!-- Single fare: the route is not intercity -->
    <SharedAppFormField
        v-if="!state.intercity"
        id="routeSinglePrice"
        name="singlePrice"
        :label="$t('routes.create.tariff.price')"
    >
        <UiInputNumber
            id="routeSinglePrice"
            v-model="state.singlePrice"
            :placeholder="$t('routes.create.tariff.pricePlaceholder')"
            fluid
        />
    </SharedAppFormField>

    <!-- Intercity, but the matrix has nothing to price yet -->
    <SharedEmpty
        v-else-if="tariffGroups.length === 0"
        :message="$t('routes.create.tariff.empty')"
        :reset-label="$t('routes.create.tariff.goToPoints')"
        :button-action="() => emit('goToPoints')"
        icon="tabler:exclamation-mark"
        layout="col"
    />

    <!-- Intercity fare matrix: one section per origin point -->
    <Accordion v-else :value="['0']" multiple>
        <AccordionPanel
            v-for="(group, index) in tariffGroups"
            :key="group.from.id"
            :value="String(index)"
        >
            <AccordionHeader>
                <UiColorChip
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
                        <UiInputNumber
                            :id="`routeTariff-${target.key}`"
                            v-model="segmentPrices[target.key]"
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
