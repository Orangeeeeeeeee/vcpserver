<template>
    <!-- Per-city fare matrix: one accordion section per origin point -->
    <Accordion :value="['0']" multiple>
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
                        :id="`routeEditTariff-${target.key}`"
                        :key="target.key"
                        :name="`tariff-${target.key}`"
                        :label="`${group.from.label} - ${target.to.label}`"
                    >
                        <InputNumber
                            v-model="segmentPrices[target.key]"
                            :input-id="`routeEditTariff-${target.key}`"
                            :min="0"
                            :max-fraction-digits="2"
                            :suffix="$t('routes.edit.price.suffix')"
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
import { useRouteEditFormContext } from '~/composables/useRouteEditForm';
import { ROUTE_TARIFF_COLORS } from '~/constants/route-form';
import type { RoutePointColor } from '~/constants/route-form';

/**
 * «Ціна за проїзд» tab of the route edit dialog: the per-city fare matrix
 * grouped by origin point (forward pairs, like the create-form tariffs).
 */

const { segmentPrices, tariffGroups } = useRouteEditFormContext();

/** Accent color of a matrix origin chip, rotated by section order */
const tariffColor = (index: number): RoutePointColor =>
    ROUTE_TARIFF_COLORS[index % ROUTE_TARIFF_COLORS.length] as RoutePointColor;
</script>
