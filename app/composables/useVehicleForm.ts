import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import type {
    Vehicle,
    VehicleCondition,
    VehicleFuel,
    VehicleFuelConsumption,
    VehicleSpeedLimits,
    VehicleTanks,
    VehicleType
} from '~/types/vehicle';
import type { AddVehicleInput } from '~/composables/useVehicles';
import type { FlagSelectOption } from '~/components/ui/FlagSelect';
import { VEHICLE_TYPE_ICONS } from '~/constants/vehicles';
import { parseUaDate, formatUaDate } from '~/utils/date';

/** Identifier of a tab in the vehicle form dialog */
export type VehicleFormTabKey = 'general' | 'exploitation' | 'settings' | 'fuel';

export interface VehicleFormState {
    company: string | null;
    year: number | null;
    name: string;
    vin: string;
    type: VehicleType | null;
    fuel: VehicleFuel[];
    brand: string;
    condition: VehicleCondition | null;
    model: string;
    country: string | null;
    driverId: string | null;
    regAddress: string;
    routes: string[];
    trackerImei: string | null;
    groupIds: string[];
    carrier: boolean;
    seats: number | null;
    comment: string;
    odometer: number | null;
    odometerDate: Date | null;
    engineHours: number | null;
    engineHoursDate: Date | null;
    consumptionAverage: number | null;
    consumptionSlow: number | null;
    consumptionNormal: number | null;
    consumptionFast: number | null;
    tankMain: number | null;
    tankExtra: number | null;
    speedNormal: number | null;
    speedMax: number | null;
}

/**
 * State, validation and helpers for the vehicle add/edit form. Created once in
 * `VehicleFormDialog` and shared with the tab components via provide/inject.
 *
 * Note: the return type is intentionally inferred (not an explicit interface) so
 * the regle `r$` type flows through `VehicleFormContext` without hand-typing it.
 */
export const useVehicleForm = () => {
    const { t } = useI18n();
    const { companies, types, fuels, conditions, countries, routeOptions } =
        useVehicles();
    const { drivers } = useDrivers();
    const { trackers } = useTrackers();
    const { groups } = useGroups();

    /** Builds the empty (add-mode) form state */
    const emptyState = (): VehicleFormState => ({
        company: null,
        year: null,
        name: '',
        vin: '',
        type: null,
        fuel: [],
        brand: '',
        condition: null,
        model: '',
        country: null,
        driverId: null,
        regAddress: '',
        routes: [],
        trackerImei: null,
        groupIds: [],
        carrier: false,
        seats: null,
        comment: '',
        odometer: null,
        odometerDate: null,
        engineHours: null,
        engineHoursDate: null,
        consumptionAverage: null,
        consumptionSlow: null,
        consumptionNormal: null,
        consumptionFast: null,
        tankMain: null,
        tankExtra: null,
        speedNormal: null,
        speedMax: null
    });

    const state = reactive<VehicleFormState>(emptyState());

    const { r$ } = useRegle(
        state,
        {
            company: { required: withMessage(required, 'validation.required') },
            name: { required: withMessage(required, 'validation.required') },
            type: { required: withMessage(required, 'validation.required') }
        },
        { lazy: true }
    );

    /** Type select options with localized label + Tabler icon */
    const typeOptions = computed(() =>
        types.map((o) => ({
            value: o.value,
            label: t(o.labelKey),
            icon: VEHICLE_TYPE_ICONS[o.value]
        }))
    );

    /** Fuel select options with localized labels */
    const fuelOptions = computed(() =>
        fuels.map((o) => ({ value: o.value, label: t(o.labelKey) }))
    );

    /** Condition select options with localized labels */
    const conditionOptions = computed(() =>
        conditions.map((o) => ({ value: o.value, label: t(o.labelKey) }))
    );

    /** Country options with resolved labels for the flag select */
    const countryOptions = computed<FlagSelectOption[]>(() =>
        countries.map((c) => ({
            value: c.value,
            label: t(c.labelKey),
            flag: c.flag
        }))
    );

    /** Driver select options sourced from the drivers domain */
    const driverOptions = computed(() =>
        drivers.value.map((d) => ({ value: d.id, label: d.name }))
    );

    /** Tracker IMEI select options sourced from the trackers domain */
    const trackerOptions = computed(() =>
        trackers.value.map((trk) => ({ value: trk.imei, label: trk.imei }))
    );

    /** Group select options sourced from the groups domain */
    const groupOptions = computed(() =>
        groups.value.map((g) => ({ value: g.id, label: g.name }))
    );

    /** Resets to empty (add) or hydrates from the vehicle (edit) */
    const hydrate = (vehicle: Vehicle | null): void => {
        Object.assign(state, emptyState());

        if (vehicle) {
            state.company = vehicle.company;
            state.year = vehicle.year ?? null;
            state.name = vehicle.name;
            state.vin = vehicle.vin ?? '';
            state.type = vehicle.type;
            state.fuel = vehicle.fuel ? [...vehicle.fuel] : [];
            state.brand = vehicle.brand;
            state.condition = vehicle.condition ?? null;
            state.model = vehicle.model;
            state.country = vehicle.country ?? null;
            state.driverId = vehicle.driverId ?? null;
            state.regAddress = vehicle.regAddress ?? '';
            state.routes = [...(vehicle.routes ?? [])];
            state.trackerImei = vehicle.trackerImei ?? null;
            state.groupIds = [...(vehicle.groupIds ?? [])];
            state.carrier = vehicle.carrier;
            state.seats = vehicle.seats ?? null;
            state.comment = vehicle.comment ?? '';
            state.odometer = vehicle.odometer ?? null;
            state.odometerDate = vehicle.odometerDate
                ? parseUaDate(vehicle.odometerDate)
                : null;
            state.engineHours = vehicle.engineHours ?? null;
            state.engineHoursDate = vehicle.engineHoursDate
                ? parseUaDate(vehicle.engineHoursDate)
                : null;
            state.consumptionAverage = vehicle.fuelConsumption?.average ?? null;
            state.consumptionSlow = vehicle.fuelConsumption?.slow ?? null;
            state.consumptionNormal = vehicle.fuelConsumption?.normal ?? null;
            state.consumptionFast = vehicle.fuelConsumption?.fast ?? null;
            state.tankMain = vehicle.tanks?.main ?? null;
            state.tankExtra = vehicle.tanks?.extra ?? null;
            state.speedNormal = vehicle.speedLimits?.normal ?? null;
            state.speedMax = vehicle.speedLimits?.max ?? null;
        }

        r$.$reset();
    };

    /** Maps the first invalid regle field to its owning tab (cross-tab UX) */
    const firstInvalidTab = (): VehicleFormTabKey => {
        // all validated fields currently live on the General tab
        return 'general';
    };

    /** Returns the section object, or undefined when every member is empty */
    const sectionOrUndefined = <T extends Record<string, number | undefined>>(
        section: T
    ): T | undefined =>
        Object.values(section).some((v) => v !== undefined)
            ? section
            : undefined;

    /** Builds the vehicle payload from the current (validated) form state */
    const buildPayload = (): AddVehicleInput => {
        const fuelConsumption = sectionOrUndefined<VehicleFuelConsumption>({
            average: state.consumptionAverage ?? undefined,
            slow: state.consumptionSlow ?? undefined,
            normal: state.consumptionNormal ?? undefined,
            fast: state.consumptionFast ?? undefined
        });
        const tanks = sectionOrUndefined<VehicleTanks>({
            main: state.tankMain ?? undefined,
            extra: state.tankExtra ?? undefined
        });
        const speedLimits = sectionOrUndefined<VehicleSpeedLimits>({
            normal: state.speedNormal ?? undefined,
            max: state.speedMax ?? undefined
        });

        return {
            name: state.name.trim(),
            company: state.company as string,
            brand: state.brand.trim(),
            model: state.model.trim(),
            year: state.year ?? undefined,
            vin: state.vin.trim() || undefined,
            type: state.type as VehicleType,
            fuel: state.fuel.length ? [...state.fuel] : undefined,
            condition: state.condition ?? undefined,
            country: state.country ?? undefined,
            regAddress: state.regAddress.trim() || undefined,
            driverId: state.driverId ?? undefined,
            routes: state.routes.length ? [...state.routes] : undefined,
            trackerImei: state.trackerImei ?? undefined,
            groupIds: state.groupIds.length ? [...state.groupIds] : undefined,
            carrier: state.carrier,
            seats: state.carrier ? (state.seats ?? undefined) : undefined,
            comment: state.comment.trim() || undefined,
            odometer: state.odometer ?? undefined,
            odometerDate: state.odometerDate
                ? formatUaDate(state.odometerDate)
                : undefined,
            engineHours: state.engineHours ?? undefined,
            engineHoursDate: state.engineHoursDate
                ? formatUaDate(state.engineHoursDate)
                : undefined,
            fuelConsumption,
            tanks,
            speedLimits
        };
    };

    return {
        state,
        r$,
        companies,
        typeOptions,
        fuelOptions,
        conditionOptions,
        countryOptions,
        routeOptions,
        driverOptions,
        trackerOptions,
        groupOptions,
        hydrate,
        firstInvalidTab,
        buildPayload
    };
};

/** Shape shared between VehicleFormDialog (provider) and its tabs (consumers) */
export type VehicleFormContext = ReturnType<typeof useVehicleForm>;

/** Injection key for the vehicle form context */
export const VEHICLE_FORM_KEY: InjectionKey<VehicleFormContext> =
    Symbol('vehicleForm');

/**
 * Injects the vehicle form context provided by `VehicleFormDialog`.
 * @returns {VehicleFormContext} The shared form state, validation and helpers.
 */
export const useVehicleFormContext = (): VehicleFormContext => {
    const ctx = inject(VEHICLE_FORM_KEY);
    if (!ctx) {
        throw new Error(
            'useVehicleFormContext must be used within VehicleFormDialog'
        );
    }
    return ctx;
};
