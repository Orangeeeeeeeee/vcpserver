# CLAUDE.md

Цей файл надає інструкції для Claude Code (claude.ai/code) при роботі з кодом цього репозиторію.

## Огляд проєкту

VCPServer — веб-застосунок на Nuxt 4 з використанням Vue 3, бібліотеки компонентів PrimeVue та Tailwind CSS v4.

## Команди

- `npm run dev` — запуск dev-сервера на http://localhost:3000
- `npm run build` — продакшн збірка
- `npm run preview` — перегляд продакшн збірки
- `npm run generate` — генерація статичного сайту
- `npm install` — після встановлення `nuxt prepare` виконується автоматично
- `npm run lint` — перевірка коду ESLint
- `npm run format` — форматування коду Prettier
- `npm run storybook` — запуск Storybook на http://localhost:6006
- `npm run build-storybook` — збірка статичного Storybook

## Стек технологій

- **Фреймворк:** Nuxt 4 з Vue 3 (Composition API)
- **UI-компоненти:** PrimeVue 4 з кастомним пресетом VcpPreset на основі Aura (`@primevue/nuxt-module`)
- **Стилі:** Tailwind CSS v4 через Vite-плагін + інтеграція `tailwindcss-primeui`. `<UiTypography>` зливає власні дефолтні класи з переданим `class` через `tailwind-merge` (`inheritAttrs: false` + `twMerge`), тому утиліти з місця виклику (`text-*`, `font-*`) чесно перебивають дефолти — цей патерн застосовувати і в інших UI-обгортках з дефолтними утиліті-класами, які має сенс переопреділяти
- **Шрифти:** `@nuxt/fonts` (Inter — базовий для `body`, Manrope; сімейства оголошені в `@theme inline` у `main.css` як `--font-inter`/`--font-manrope`). У `nuxt.config.ts` задано `fonts.defaults.weights: ['400 700']` (варіативний діапазон) — НЕ видаляти: без цього модуль вантажить лише вагу 400 (дефолт `fontless`), і medium/semibold/bold рендеряться синтезованими з 400. У Storybook `@nuxt/fonts` не працює — там прямі імпорти `@fontsource-variable/inter` та `@fontsource-variable/manrope` у `preview.ts`
- **Іконки:** `@nuxt/icon` (Iconify, SVG mode), колекція **Tabler Icons** (`tabler:icon-name`). Кастомні SVG — в `app/assets/icons/` з префіксом `custom:` (`<Icon name="custom:logo" />`). В Storybook — `import { Icon } from '@iconify/vue'` з `<Icon icon="tabler:arrow-left" />`
- **Лінтер:** ESLint через `@nuxt/eslint` (конфіг генерується автоматично у `.nuxt/eslint.config.mjs`) + Prettier для форматування
- **Інтернаціоналізація:** `@nuxtjs/i18n` (vue-i18n, Composition API mode). Локаль PrimeVue (назви місяців/днів DatePicker, тиждень з понеділка, формат `dd.mm.yy`) — часткові українські оверрайди `UK_LOCALE` у `app/theme/primevue-locale.ts`, передаються як `options.locale` у `nuxt.config.ts` та в `preview.ts` Storybook; PrimeVue сам глибоко мерджить їх поверх дефолтної англійської, тому неперекладені ключі зберігаються
- **Карти:** `leaflet` (+ `@types/leaflet`) у client-only компоненті (`*.client.vue`) з тайлами Mapbox Static Tiles API; access token — env `NUXT_PUBLIC_MAPBOX_TOKEN` → `runtimeConfig.public.mapboxToken`. Спільна обв'язка (ініціалізація, тайли street/satellite, zoom, fullscreen) — composable `useLeafletMap`; контейнер карти шукати за унікальним `id`, НЕ через template ref (у `.client.vue` вони ненадійні). Малювання геозон — `@geoman-io/leaflet-geoman-free` (без вбудованого тулбару, режими вмикаються з кастомних кнопок `UiMapAction`). Спільні частини онлайн-карт (флот + детальна сторінка ТЗ): `<OnlineMapControls>` (стек контролів + popover'и шарів/легенди), `<OnlineMapSearch>` (пошук по ТЗ) та хелпери маркерів `app/components/online/markers.ts` (+ глобальний CSS `markers.css`; імпортувати лише з `.client.vue`)
- **Відеоплеєр:** `vidstack` (ставити з тегом `next` — `npm i vidstack@next`; `latest` на npm — застаріла 0.6.x). Це web components (`<media-*>`): теги оголошені custom elements через `vue.compilerOptions.isCustomElement` у `nuxt.config.ts`, типи тегів для шаблонів — `app/types/vidstack-vue.d.ts` (`import type {} from 'vidstack/vue'`). Використовувати лише через обгортку `<UiVideoPlayer>` (`app/components/ui/VideoPlayer/VideoPlayer.client.vue`, client-only — реєстрація елементів і стилі імпортуються всередині): **власний мінімальний лейаут** з headless-примітивів (`media-controls`, `media-time-slider`, `media-play-button`, `media-menu` зі швидкістю тощо) — дефолтні лейаути/теми vidstack НЕ імпортуються, лише `styles/base.css`. Стилізація — Tailwind по станах через `data-*`-атрибути елементів (`data-paused`, `data-visible`, `data-open`, `data-buffering`, `data-supported`) і CSS-змінні слайдерів (`--slider-fill`/`--slider-progress`); іконки — Tabler; aria-підписи — i18n `player.*`; другорядні контроли (гучність/швидкість/PiP) ховаються на вузьких плеєрах через container queries (`@container` на `media-controls`, брейк `@sm`). Розмір задає батьківський контейнер. HLS (`.m3u8`) працює з коробки — hls.js ліниво підвантажується з CDN. Мок-відео (камери ТЗ, відео зупинок пасажиропотоку) — спільний каталог `DEMO_MEDIA_SOURCES` у `mocks/demo-media.ts` (пари `streamUrl`/`posterUrl`)
- **Сторінки «панель + карта»** (online, список/створення/редагування зон, детальна сторінка ТЗ): спільний компонент `<SharedPanelMapLayout>` (`app/components/shared/PanelMapLayout/`) — слоти `#panel`/`#map`, `v-model:view` (`'panel' | 'map'`) перемикає панель-overlay нижче `lg`; карта завжди відрендерена (ховається перекриттям, не `v-if`). Стан сторінки шериться між панеллю та картою через composable + `provide`/`inject` з `InjectionKey` (патерн `useOnlineFleet`/`useZoneForm`/`useVehicleOnline`)
- **Детальна сторінка ТЗ** (`/vehicles/[id]` «Онлайн» + `/vehicles/[id]/history` «Історія»): спільна шапка (таби, breadcrumbs, share/edit/delete з діалогами) — `<VehicleDetailPageShell>`; резолв ТЗ з маршруту + 404 — `useOnlineVehicleFromRoute`. Компоненти в `app/components/vehicle/`, стан вкладок — `useVehicleOnline` / `useVehicleHistory` (provide/inject). Відео камер — `<VehicleCameraPlayer>` (Vidstack `<UiVideoPlayer>` з мок-потоком камери, `load="play"`, muted+loop): на `md+` прев'ю поверх карти (`<VehicleCameraPreviews>`) + бар чіпів `<VehicleVideoDock>` під картою, нижче `md` — окремий екран зі стеком плеєрів. Історія: домен `types/history.ts` + `mocks/history.ts` (детермінований `generateVehicleHistory(vehicle, periodSeed)`), фільтр дати `<VehicleHistoryPeriodFilter>`, стрічка подій (`HISTORY_EVENT_META` у `constants/history.ts`), маршрут A→B на `<VehicleHistoryMap>`, таймлайн `<VehicleHistoryTimeline>` (тонкий бар під картою або в панелі телеметрії) і `<VehicleTelemetryPanel>` (Highcharts area + живе відтворення курсора 1x–10x). Таби «рейси» — лише посилання-константи, сторінок ще немає
- **Створення маршруту** (`/routes/new`): `<SharedPanelMapLayout>` + стан форми `useRouteForm` (provide/inject, патерн `useZoneForm`), таби форми — `UiTabNav` + `v-show` (усі поля змонтовані, помилки regle живі між табами, стрибок на перший невалідний таб при сабміті). Компоненти в `app/components/routes/`. Геокодингу немає: адреси точок — мок-каталог `mocks/routes.ts` (AutoComplete) + pick-режим на карті (`pickingPointId` у формі, клік по `RoutesFormMap`); відстань сегмента — haversine (`utils/geo.ts`), час до точки вводиться вручну. Тарифи «Міжмісто» — матриця пар вперед (i→j), ключі `"{fromId}-{toId}"`; «Імпорт JSON» замінює точки (схема в JSDoc `importPoints`)
- **Списки маршрутів** (`/routes` «Регулярні» + `/routes/scheduled` «Заплановані»; таби секції у `pages/routes.vue`, таб «Скасовані рейси» — константа-заглушка в `ROUTES` з `trailingIcon`, таби ховаються на `/routes/new`): обидві сторінки — тонкі обгортки над `<RoutesListView :scheduled>` (пошук за назвою/маршрутом, фільтри, `SharedResponsiveTable` rows=6, колонка «Дата» лише для запланованих). Домен: `Route.status: RouteStatus` (`'active' | 'inactive'`, метадані — `constants/route-list.ts`) + `driverIds`; мок-список — `generateRoutes()` у `mocks/routes.ts`, сідить `useRoutes` (`create/update/deleteRoute`); дистанція/тривалість — `utils/routes.ts`. Фільтри — `useRouteFilters` (provide/inject, патерн `useDriverFilters`; чіпи активних значень `activeChips`) + `<RoutesFiltersPopover>`. Редагування — модалка `<RoutesRouteEditDialog>` (`route-edit/`, патерн `DriverFormDialog`) зі станом `useRouteEditForm`: 3 таби (Основне / Точки маршруту — лише назва+час, без додавання-видалення точок / Ціна за проїзд — завжди акордеон вартості по містах: пари вперед між точками, ключі `"{fromId}-{toId}"` як у create-формі); усі інпути обов'язкові — regle `$each` по точках (час не вимагається лише для старту) + реактивні правила по поточних ключах матриці цін, `firstInvalidTab` веде на перший невалідний таб; відкривається олівцем у колонці дій (клік по назві веде на детальну сторінку маршруту). Видалення — `SharedConfirmDeleteDialog` (`group="confirmDeleteRoute"`)
- **Групи маршрутів** (`/routes/groups`, таб «Групи» секції маршрутів): сітка карток 1/2/4 колонки за патерном `/objects/groups` (пошук за назвою, попап фільтрів компанія+статус, чіпи лише компаній у барі, сортування за `order`, `UiPagination` по 8). Домен `types/route-group.ts`: `RouteGroup` (`status: 'active' | 'inactive'`, `order`, `comment?`, впорядкований `routeIds`) — окрема сутність, НЕ плутати з групами ТЗ (`types/group.ts`, без поля `color`); моки — `generateRouteGroups()` у `mocks/route-groups.ts`, стан — `useRouteGroups`, фільтри — `useRouteGroupFilters`. Компоненти в `app/components/routes/groups/` (авто-імпорт `RoutesGroups*`): картка `GroupsCard` (патерн `ObjectsGroupCard`, але нейтральний хедер без кольору; рядки — `NuxtLink` на `ROUTE_DETAIL` з ↗, «мертві» routeIds мовчки пропускаються; тогл «Розгорнути» — за виміром через `useGroupCardCapacity`, спільний для обох карток груп: сітка розтягує картки до найвищої в ряду, тож якщо повний список влазить у картку — показуються всі рядки без тогла, інакше — стільки, скільки влазить (мін. 3, `GROUP_CARD_BASELINE_ROWS`) + тогл), форма `GroupsFormDialog` + `useRouteGroupForm` (патерн `GroupFormDialog`: таби Основне / Маршрути — MultiSelect з усіх маршрутів, опції з `(№id)` бо назви дублюються, drag-список порядку). Видалення — `SharedConfirmDeleteDialog` (`group="confirmDeleteRouteGroup"`)
- **Списки рейсів** (`/routes/trips/active` «Активні рейси» + `/routes/trips/archive` «Архівні рейси»; таб «Скасовані рейси» — заглушка, скасовані показуються в архіві): обидві сторінки — тонкі обгортки над `<RoutesTripsListView :archive>` (пошук за назвою/шляхом маршруту, `SharedResponsiveTable` rows=6). Домен `types/trip.ts`: `Trip` (`status: 'active' | 'finished' | 'cancelled'`, планові/фактичні дистанція й час, `trackMatchPercent`, `resources: TripResource[]` — пари ТЗ+водій зі своїм `status: 'waiting' | 'moving' | 'offRoute'`, прогресом та останньою адресою); метадані статусів + пороги кольорів «Збігу треків» (≥75 зелений, 25–74 amber, <25 червоний) — `constants/trip-list.ts`. Моки — `generateTrips()` у `mocks/trips.ts` (один рейс на кожен мок-маршрут, детермінований), стан — `useTrips` (лише видалення, create/edit немає). Фільтри — `useTripFilters` (provide/inject, патерн `useRouteFilters`): компанія/маршрут/ТЗ/водій, для архіву + дата (DatePicker, день старту) і стан (порожньо = всі). Перевищення факту над планом (дистанція/час) підсвічується червоним; ↗/«Перейти» на активних відкриває модалку ресурсів `RoutesTripsResourcesDialog` (прогрес-бар, >100% — червоний); колонка «Маршрут» — посилання на `ROUTE_DETAIL`. Видалення — `SharedConfirmDeleteDialog` (`group="confirmDeleteTrip"`)
- **Детальна сторінка маршруту** (`/routes/[id]`, константа `ROUTES.ROUTE_DETAIL(id)`): `<SharedPanelMapLayout>` + стан `useRouteView` (provide/inject), резолв маршруту з `[id]` + 404 — `useRouteDetailFromRoute` (патерн `useOnlineVehicleFromRoute`). Батьківський `pages/routes.vue` на детальній сторінці підмінює title (назва маршруту) і таби (Маршрут / Активні рейси ↗ / Архівні рейси ↗). Панель `RouteViewPanel`: компанія (`COMPANY_BADGES`), бейдж статусу (`scheduled` → «Запланований», інакше `ROUTE_STATUS_META`), дата з `startAt` + кінець = старт + тривалість, групи-чіпи, «Ресурси» — пари ТЗ+водій за індексом (згорнуто 2, тогл при >2), таймлайн точок через спільний `<SharedEventFeed>` (`shared/EventFeed/`, витягнутий зі стрічки подій історії ТЗ; бейджі/іконки точок — `constants/route-view.ts`), сегменти «Рух» = `timeToPoint` наступної точки + haversine-відстань; час стоянки — опційне `RoutePoint.stopDurationMinutes` (лише моки, форми його не редагують). Карта `RouteViewMap.client.vue` (read-only): полілінія + піни A/B + типізовані маркери проміжних точок, контроли `RouteViewMapControls` (шари/zoom/легенда точок/fullscreen, без пошуку), кнопки «Google Maps» (dir-посилання по координатах точок) та «Експорт JSON» (файл у схемі `importPoints` — roundtrip з імпортом create-форми). Редагування/видалення в шапці — реюз `<RoutesRouteEditDialog>` і `SharedConfirmDeleteDialog` (`group="confirmDeleteRouteDetail"`), після видалення — повернення у відповідний список за `scheduled`
- **Storybook:** Storybook 10 (`@storybook/vue3-vite`)

## Архітектура

- `app/` — основна директорія застосунку (конвенція Nuxt 4)
    - `app.vue` — кореневий компонент з `<NuxtLayout>` + `<NuxtPage>`
    - `layouts/` — компоненти лейаутів (`default`, `blank` з бічною навігацією)
    - `pages/` — маршрутизація на основі файлів
    - `assets/css/main.css` — глобальні стилі з імпортом Tailwind та PrimeUI + `@theme inline` для semantic кольорів
    - `theme/colors.ts` — константи дизайнерської палітри кольорів
    - `theme/preset.ts` — кастомний PrimeVue пресет (`definePreset(Aura, overrides)`)
    - `constants/` — константи застосунку: `routes.ts` (шляхи маршрутів — об'єкт `ROUTES`) та `navigation.ts` (пункти бічної навігації `navigationItems`)
    - `types/` — доменні TS-типи (`driver.ts`, `tracker.ts`, `zone.ts`, `route.ts`); НЕ auto-imported, імпортувати явно (`import type { Driver } from '~/types/driver'`)
    - `mocks/` — мок-дані та генератори (`drivers.ts`, `trackers.ts`, `zones.ts`, `companies.ts`, `routes.ts`); імпортуються явно у composables, видаляються при підключенні реального API
    - `utils/` — auto-imported утиліти Nuxt (напр. `validations.ts`, `date.ts`, `string.ts`)
- `stories/` — Storybook сторіз (`primevue/`, `ColorPalette/`)
- `i18n/locales/` — файли перекладів (JSON), за замовчуванням `ua.json`

## Ключова конфігурація

- **Темна тема:** на основі селектора `[data-theme="dark"]`
- **CSS-шари:** PrimeVue використовує порядок `@layer`: `theme, base, primevue`
- **Кастомний dark-варіант:** визначений як `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` у main.css
- **Tailwind CSS** підключений як Vite-плагін (не PostCSS), налаштований у `nuxt.config.ts`
- **Кольорова палітра:** кастомний пресет VcpPreset (`app/theme/preset.ts`) на основі Aura з дизайнерськими кольорами (`app/theme/colors.ts`). Пресет імпортується у `nuxt.config.ts`, тому зміни файлів теми (`app/theme/**`) НЕ підхоплюються HMR — потрібен рестарт dev-сервера (досить `touch nuxt.config.ts`). Експорти: `primary` (бренд-колір), `surface` (нейтральні), `primitiveColors` (green, red, yellow, indigo, teal, violet, sky, rose, amber). Через `tailwindcss-primeui` автоматично бріджаться `primary` та `surface` палітри. Semantic кольори (`success`, `error`, `warning`) бріджаться вручну через `@theme inline` в `main.css`

## Storybook

- **Конфігурація:** `.storybook/main.ts` та `.storybook/preview.ts`
- **Сторіз:** розміщуються поруч з компонентами як `*.stories.ts` (у `app/components/`) або у `stories/`
- **Tailwind CSS v4:** підключений через `@tailwindcss/vite` плагін у `viteFinal` хуці (`main.ts`)
- **PrimeVue:** зареєстрований як Vue-плагін через `setup()` у `preview.ts` з кастомним пресетом VcpPreset та налаштуваннями dark mode
- **Alias `~`:** налаштований у `viteFinal` як `path.resolve(__dirname, '../app')` для підтримки Nuxt-алясів у Storybook
- **Глобальні стилі:** імпортовані з `app/assets/css/main.css` у `preview.ts`
- **Типи для сторіз:** імпортувати `Meta`, `StoryObj` з `@storybook/vue3-vite`

## Форми

- **Валідація:** `@regle/core` + `@regle/rules` — headless, model-based валідація через composable `useRegle`. Валідація виконується на submit через `r$.$validate()`. Перевикористовувані правила зберігаються в `app/utils/validations.ts` (auto-imported Nuxt). Наявні: `emailRules()`, `passwordRules()`
- **Поля форми:** для побудови полів форми використовувати компонент `<SharedAppFormField>` (`app/components/shared/AppFormField.vue`). Він містить label + повідомлення про помилки (проп `error` приймає i18n-ключ або масив ключів — передавати весь `$errors`, рендериться по одному `Message` на помилку). Інпут передається через слот.
- **MultiSelect:** голий PrimeVue `<MultiSelect>` у застосунку не використовувати — скрізь обгортка `<UiMultiSelect>` (`app/components/ui/MultiSelect/`). З пропом `show-select-all` інʼєктить синтетичну опцію «Вибрати всі» першим рядком списку (лейбл — `common.selectAll`, кастомний — проп `select-all-label`); зовнішній `v-model` ніколи не містить службове значення. Без `show-select-all` — прозора заміна MultiSelect. Обмеження `show-select-all` (у таких місцях не вмикати): примітивні значення, без option-groups і функційного `optionLabel`, не поєднувати з `maxSelectedLabels`; лейбл згорнутого поля — `display="chip"` або кастомний `#value` (слот отримує значення вже без сентинела), дефолтний comma-лейбл показував би сентинел
- **Приклад використання:**

    ```vue
    <script setup>
    import { useRegle } from '@regle/core';

    const state = reactive({ email: '', password: '' });

    const { r$ } = useRegle(state, {
        email: emailRules(),
        password: passwordRules()
    });

    const onSubmit = async () => {
        // regle's $validate() returns a RegleResult object ({ valid, data, ... }),
        // NOT a boolean — destructure `valid`, never `if (result)`.
        const { valid } = await r$.$validate();
        if (valid) {
            console.log('Submit:', state);
        }
    };
    </script>

    <template>
        <form novalidate @submit.prevent="onSubmit">
            <SharedAppFormField
                name="email"
                :label="$t('login.email')"
                id="email"
                :error="r$.$fields.email.$errors"
            >
                <InputText
                    id="email"
                    v-model="state.email"
                    type="email"
                    fluid
                />
            </SharedAppFormField>
        </form>
    </template>
    ```

## Маршрути та навігація

- **Усі шляхи маршрутів — константи** в `app/constants/routes.ts` (об'єкт `ROUTES`, ключі у `SCREAMING_SNAKE_CASE`, `as const`).
- **При створенні нової сторінки** (`app/pages/...`) обов'язково додати відповідну константу до `ROUTES`.
- **Будь-які посилання та переходи — лише через `ROUTES`**, без хардкоду рядків шляхів. Стосується `<NuxtLink :to>`, `<Button as="router-link" :to>`, `navigateTo()`, `router.push()`, `redirect`, `routeRules` у `nuxt.config.ts` та пунктів навігації.
- Імпорт: `import { ROUTES } from '~/constants/routes';` (у `nuxt.config.ts` — відносним шляхом `import { ROUTES } from './app/constants/routes';`).
- Пункти бічної навігації — у `app/constants/navigation.ts` (масив `navigationItems`, кожен `route` посилається на `ROUTES`).

## Конвенції

- Текст інтерфейсу українською мовою
- Тексти інтерфейсу виносити у файли локалізації (`i18n/locales/ua.json`), у шаблонах використовувати `$t('key')` або `useI18n()` composable
- Сторінки вказують лейаут через `definePageMeta({ layout: 'layoutName' })`
- Телепорти у контейнери `PageLayout` (`#page-actions-header`, `#page-actions-target`, `#page-breadcrumbs-target`) — лише через `<SharedClientTeleport :to>` (обгортка `ClientOnly` + `Teleport`), НЕ голий `<Teleport>`: Nuxt рендерить SSR-телепорти лише в `#teleports`, голий телепорт спричиняє hydration mismatch
- Тости: у лейаутах монтувати лише `<SharedAppToast>` (`shared/AppToast.vue`) — `top-right` на десктопі, `top-center` нижче `md`; ширина — по контенту (`fit-content`) з капом `min(25rem, 100vw - 2rem)` через інлайн-`style` (перебиває токен `toast.width`); голий PrimeVue `<Toast>` не монтувати. Позиція тоста — інлайн-стилі з пропа `position`, тому перемикається реактивним пропом через `useMediaQuery`, а не CSS-override'ом
- Розгортання/згортання контенту анімувати slide-up/slide-down (WAAPI, тривалість масштабується від висоти — хелпери в `utils/animation.ts`, поважають `prefers-reduced-motion`): `v-if`/`v-show`-блоки — через `<SharedCollapseTransition>` (слот — один блоковий елемент без власних вертикальних margin); «показати ще»-списки зі `slice` — обгорткою `<SharedAnimatedHeight>` (ResizeObserver, атрибути/класи падають на внутрішній контейнер, розмітку списку міняти не треба). Винятки — картки груп (`ObjectsGroupCard`, `RoutesGroupsCard`) і водіїв: без анімації
- Коментарі та JSDoc писати **англійською мовою**
- Весь TypeScript-код повинен мати **JSDoc-коментарі**: функції, composables, утиліти, константи
- Для всіх функцій та composables додавати **явні типи** параметрів та повертаємих значень
- Де можливо, створювати **інтерфейси (`interface`)** або **типи (`type`)** для структур даних, пропсів, повертаємих значень composables тощо
- Composables: визначати `UseFooParams` interface/type для вхідних даних (якщо є) та `UseFooReturn` interface для повертаємих значень. Додавати JSDoc з `@param` та `@returns {UseFooReturn}`
- Не додавати JSDoc до інтерфейсів/типів, якщо назва вже є самодокументованою (наприклад, `SidebarHeaderProps` не потребує `/** Props for SidebarHeader */`)
- Не додавати коментарі до реекспортів у barrel-файлах (`index.ts`)

## Оновлення інструкцій

При внесенні змін до проєкту (нові модулі, зміна архітектури, нові конвенції, зміна конфігурації) необхідно оновити цей файл CLAUDE.md відповідно до внесених змін.
