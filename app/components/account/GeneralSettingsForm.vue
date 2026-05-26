<template>
    <form class="flex flex-col gap-5 md:gap-7" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
            <div class="flex flex-col gap-4">
                <SharedAppFormField
                    id="language"
                    name="language"
                    :label="$t('account.settings.language')"
                >
                    <Select
                        id="language"
                        v-model="state.language"
                        :options="LANGUAGES"
                        option-value="value"
                        :option-label="(o) => t(o.labelKey)"
                        fluid
                    >
                        <template #value="{ value }">
                            <span
                                v-if="selectedLanguage"
                                class="flex items-center gap-2"
                            >
                                <Icon
                                    :name="selectedLanguage.flag"
                                    class="size-5"
                                />
                                <span>{{ t(selectedLanguage.labelKey) }}</span>
                            </span>
                            <span v-else>{{ value }}</span>
                        </template>
                        <template #option="{ option }">
                            <span class="flex items-center gap-2">
                                <Icon :name="option.flag" class="size-5" />
                                <span>{{ t(option.labelKey) }}</span>
                            </span>
                        </template>
                    </Select>
                </SharedAppFormField>

                <SharedAppFormField
                    id="timezone"
                    name="timezone"
                    :label="$t('account.settings.timezone')"
                >
                    <Select
                        id="timezone"
                        v-model="state.timezone"
                        :options="TIMEZONES"
                        option-value="value"
                        :option-label="(o) => t(o.labelKey)"
                        fluid
                    />
                </SharedAppFormField>

                <div class="flex flex-col gap-4 lg:flex-row lg:gap-6">
                    <SharedAppFormField
                        id="theme"
                        name="theme"
                        :label="$t('account.settings.theme')"
                    >
                        <SelectButton
                            v-model="state.theme"
                            :options="THEME_OPTIONS"
                            option-value="value"
                            :option-label="(o) => t(o.labelKey)"
                            :allow-empty="false"
                        />
                    </SharedAppFormField>

                    <SharedAppFormField
                        id="menuPosition"
                        name="menuPosition"
                        :label="$t('account.settings.menuPosition')"
                    >
                        <SelectButton
                            v-model="state.menuPosition"
                            :options="MENU_POSITIONS"
                            option-value="value"
                            :option-label="(o) => t(o.labelKey)"
                            :allow-empty="false"
                        />
                    </SharedAppFormField>
                </div>
            </div>
            <div class="flex flex-col gap-4">
                <SharedAppFormField
                    id="timeFormat"
                    name="timeFormat"
                    :label="$t('account.settings.timeFormat')"
                >
                    <SelectButton
                        v-model="state.timeFormat"
                        :options="TIME_FORMATS"
                        option-value="value"
                        :option-label="(o) => t(o.labelKey)"
                        :allow-empty="false"
                    />
                </SharedAppFormField>

                <SharedAppFormField
                    id="currency"
                    name="currency"
                    :label="$t('account.settings.currency')"
                >
                    <SelectButton
                        v-model="state.currency"
                        :options="CURRENCIES"
                        option-value="value"
                        :option-label="(o) => t(o.labelKey)"
                        :allow-empty="false"
                    />
                </SharedAppFormField>
                <SharedAppFormField
                    id="units"
                    name="units"
                    :label="$t('account.settings.units')"
                >
                    <SelectButton
                        v-model="state.units"
                        :options="UNITS_SYSTEMS"
                        option-value="value"
                        :option-label="(o) => t(o.labelKey)"
                        :allow-empty="false"
                    />
                </SharedAppFormField>
            </div>
        </div>

        <div class="flex gap-3">
            <Button
                type="button"
                severity="secondary"
                class="w-full md:w-auto"
                :label="$t('account.settings.cancel')"
                @click="onCancel"
            />
            <Button
                type="submit"
                class="w-full md:w-auto"
                :label="$t('account.settings.save')"
            />
        </div>
    </form>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import {
    LANGUAGES,
    TIMEZONES,
    TIME_FORMATS,
    CURRENCIES,
    THEME_OPTIONS,
    MENU_POSITIONS,
    UNITS_SYSTEMS,
    type Currency,
    type MenuPosition,
    type TimeFormat,
    type UnitsSystem
} from '~/constants/settings';

interface GeneralSettingsState {
    language: string;
    timeFormat: TimeFormat;
    timezone: string;
    currency: Currency;
    theme: 'light' | 'dark';
    menuPosition: MenuPosition;
    units: UnitsSystem;
}

const { t } = useI18n();
const toast = useToast();
const { settings } = useAccountSettings();
const { theme, setTheme } = useTheme();

const state = reactive<GeneralSettingsState>({
    language: settings.value.language,
    timeFormat: settings.value.timeFormat,
    timezone: settings.value.timezone,
    currency: settings.value.currency,
    theme: theme.value,
    menuPosition: settings.value.menuPosition,
    units: settings.value.units
});

/** Currently selected language option (for the value-slot in Select) */
const selectedLanguage = computed(() =>
    LANGUAGES.find((l) => l.value === state.language)
);

/** Resets the form back to the currently stored settings */
const onCancel = (): void => {
    state.language = settings.value.language;
    state.timeFormat = settings.value.timeFormat;
    state.timezone = settings.value.timezone;
    state.currency = settings.value.currency;
    state.theme = theme.value;
    state.menuPosition = settings.value.menuPosition;
    state.units = settings.value.units;
};

/** Persists settings, applies theme, and shows a success toast */
const onSubmit = (): void => {
    settings.value = {
        ...settings.value,
        language: state.language,
        timeFormat: state.timeFormat,
        timezone: state.timezone,
        currency: state.currency,
        menuPosition: state.menuPosition,
        units: state.units
    };
    if (state.theme !== theme.value) {
        setTheme(state.theme);
    }
    toast.add({
        severity: 'success',
        summary: t('account.settings.saved'),
        life: 3000
    });
};
</script>
