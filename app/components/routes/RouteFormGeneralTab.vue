<template>
    <div class="flex flex-col">
        <!-- «Основне» -->
        <section class="flex flex-col gap-4 p-4">
            <h3 class="font-semibold text-surface-900">
                {{ $t('routes.create.general.title') }}
            </h3>

            <SharedAppFormField
                id="routeCompany"
                name="company"
                :label="$t('routes.create.general.company')"
                :error="r$.$fields.company.$errors"
            >
                <Select
                    v-model="state.company"
                    input-id="routeCompany"
                    :options="mockCompanies"
                    :placeholder="
                        $t('routes.create.general.companyPlaceholder')
                    "
                    :invalid="r$.$fields.company.$error"
                    fluid
                />
            </SharedAppFormField>

            <SharedAppFormField
                id="routeName"
                name="name"
                :label="$t('routes.create.general.name')"
                :error="r$.$fields.name.$errors"
            >
                <InputText
                    id="routeName"
                    v-model="state.name"
                    :placeholder="$t('routes.create.general.namePlaceholder')"
                    :invalid="r$.$fields.name.$error"
                    fluid
                />
            </SharedAppFormField>

            <label class="flex items-center self-start gap-3 text-sm text-surface-900 cursor-pointer shrink">
                <ToggleSwitch v-model="state.active" />
                {{ $t('routes.create.general.active') }}
            </label>

            <div>
                <label
                    class="inline-flex items-center gap-3 text-sm text-surface-900 cursor-pointer"
                >
                    <ToggleSwitch v-model="state.scheduled" />
                    {{ $t('routes.create.general.scheduled') }}
                </label>
                <SharedAnimatedHeight v-model:expanded="state.scheduled">
                    <SharedAppFormField
                        id="routeStartAt"
                        name="startAt"
                        :label="$t('routes.create.general.startAt')"
                        :error="r$.$fields.startAt.$errors"
                        class="pt-4"
                    >
                        <DatePicker
                            v-model="state.startAt"
                            input-id="routeStartAt"
                            show-time
                            hour-format="24"
                            show-icon
                            icon-display="input"
                            :min-date="new Date()"
                            :placeholder="
                                $t(
                                    'routes.create.general.startAtPlaceholder'
                                )
                            "
                            :invalid="r$.$fields.startAt.$error"
                            :pt="{
                                panel: {
                                    class: 'route-form-datepicker-panel'
                                }
                            }"
                            fluid
                        />
                    </SharedAppFormField>
                </SharedAnimatedHeight>
            </div>

            <SharedAppFormField
                id="routeErrorCount"
                name="errorCount"
                :label="$t('routes.create.general.errorCount')"
            >
                <UiInputNumber
                    id="routeErrorCount"
                    v-model="state.errorCount"
                    :placeholder="
                        $t('routes.create.general.errorCountPlaceholder')
                    "
                    fluid
                />
            </SharedAppFormField>
        </section>

        <!-- «Перевезення пасажирів» -->
        <section
            class="flex flex-col items-start gap-4 border-t border-surface-300 p-4"
        >
            <h3 class="font-semibold text-surface-900">
                {{ $t('routes.create.passenger.title') }}
            </h3>

            <label class="flex items-center gap-3 text-sm text-surface-900 grow-0 cursor-pointer">
                <ToggleSwitch v-model="state.passenger" />
                {{ $t('routes.create.passenger.route') }}
            </label>

            <template v-if="state.passenger">
                <label
                    class="flex items-center gap-3 text-sm text-surface-900 cursor-pointer grow-0"
                >
                    <ToggleSwitch v-model="state.intercity" />
                    {{ $t('routes.create.passenger.intercity') }}
                </label>

                <label
                    class="flex items-center gap-3 text-sm text-surface-900 cursor-pointer grow-0"
                >
                    <ToggleSwitch v-model="state.reverseCalculation" />
                    {{ $t('routes.create.passenger.reverseCalculation') }}
                </label>
            </template>
        </section>

        <!-- «Пасажирський тариф» -->
        <section
            v-if="state.passenger"
            class="flex flex-col gap-4 border-t border-surface-300 p-4"
        >
            <h3 class="font-semibold text-surface-900">
                {{ $t('routes.create.tariff.title') }}
            </h3>

            <RoutesRouteTariffSection
                @go-to-points="emit('goToPoints')"
            />
        </section>
    </div>
</template>

<style>
/* Override PrimeVue's JS-set min-width so the calendar popup keeps its natural width */
.route-form-datepicker-panel {
    min-width: auto !important;
}
</style>

<script setup lang="ts">
import { useRouteFormContext } from '~/composables/useRouteForm';
import { mockCompanies } from '~/mocks/companies';

/** «Основне» tab: route basics, passenger toggles and the tariff section. */

const emit = defineEmits<{
    /** The tariff placeholder asked to jump to the «Точки маршруту» tab */
    goToPoints: [];
}>();

const { state, r$ } = useRouteFormContext();
</script>
