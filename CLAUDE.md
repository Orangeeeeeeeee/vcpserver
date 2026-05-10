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
- **Стилі:** Tailwind CSS v4 через Vite-плагін + інтеграція `tailwindcss-primeui`
- **Іконки:** `@nuxt/icon` (Iconify, SVG mode), колекція **Tabler Icons** (`tabler:icon-name`). Кастомні SVG — в `app/assets/icons/` з префіксом `custom:` (`<Icon name="custom:logo" />`). В Storybook — `import { Icon } from '@iconify/vue'` з `<Icon icon="tabler:arrow-left" />`
- **Лінтер:** ESLint через `@nuxt/eslint` (конфіг генерується автоматично у `.nuxt/eslint.config.mjs`) + Prettier для форматування
- **Інтернаціоналізація:** `@nuxtjs/i18n` (vue-i18n, Composition API mode)
- **Storybook:** Storybook 10 (`@storybook/vue3-vite`)

## Архітектура

- `app/` — основна директорія застосунку (конвенція Nuxt 4)
    - `app.vue` — кореневий компонент з `<NuxtLayout>` + `<NuxtPage>`
    - `layouts/` — компоненти лейаутів (`default`, `blank` з бічною навігацією)
    - `pages/` — маршрутизація на основі файлів
    - `assets/css/main.css` — глобальні стилі з імпортом Tailwind та PrimeUI + `@theme inline` для semantic кольорів
    - `theme/colors.ts` — константи дизайнерської палітри кольорів
    - `theme/preset.ts` — кастомний PrimeVue пресет (`definePreset(Aura, overrides)`)
- `stories/` — Storybook сторіз (`primevue/`, `ColorPalette/`)
- `i18n/locales/` — файли перекладів (JSON), за замовчуванням `ua.json`

## Ключова конфігурація

- **Темна тема:** на основі селектора `[data-theme="dark"]`
- **CSS-шари:** PrimeVue використовує порядок `@layer`: `theme, base, primevue`
- **Кастомний dark-варіант:** визначений як `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` у main.css
- **Tailwind CSS** підключений як Vite-плагін (не PostCSS), налаштований у `nuxt.config.ts`
- **Кольорова палітра:** кастомний пресет VcpPreset (`app/theme/preset.ts`) на основі Aura з дизайнерськими кольорами (`app/theme/colors.ts`). Експорти: `primary` (бренд-колір), `surface` (нейтральні), `primitiveColors` (green, red, yellow, indigo, teal, violet, sky, rose, amber). Через `tailwindcss-primeui` автоматично бріджаться `primary` та `surface` палітри. Semantic кольори (`success`, `error`, `warning`) бріджаться вручну через `@theme inline` в `main.css`

## Storybook

- **Конфігурація:** `.storybook/main.ts` та `.storybook/preview.ts`
- **Сторіз:** розміщуються поруч з компонентами як `*.stories.ts` (у `app/components/`) або у `stories/`
- **Tailwind CSS v4:** підключений через `@tailwindcss/vite` плагін у `viteFinal` хуці (`main.ts`)
- **PrimeVue:** зареєстрований як Vue-плагін через `setup()` у `preview.ts` з кастомним пресетом VcpPreset та налаштуваннями dark mode
- **Alias `~`:** налаштований у `viteFinal` як `path.resolve(__dirname, '../app')` для підтримки Nuxt-алясів у Storybook
- **Глобальні стилі:** імпортовані з `app/assets/css/main.css` у `preview.ts`
- **Типи для сторіз:** імпортувати `Meta`, `StoryObj` з `@storybook/vue3-vite`

## Форми

- **Бібліотека:** `@primevue/forms` — компоненти `Form`, `FormField` для декларативної роботи з формами
- **Валідація:** `zod` через `zodResolver` з `@primevue/forms/resolvers/zod`. Всі форми валідуються тільки на submit (налаштовано в `AppFormField`). Перевикористовувані схеми валідації зберігаються в `app/utils/validations.ts` (auto-imported Nuxt). Наявні: `emailSchema()`, `passwordSchema()`
- **Поля форми:** для побудови полів форми використовувати компонент `<SharedAppFormField>` (`app/components/shared/AppFormField.vue`). Він обгортає `FormField` + label + повідомлення про помилку. Інпут передається через слот.
- **Приклад використання:**
  ```vue
  <script setup>
  import { Form } from '@primevue/forms';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import { z } from 'zod';

  const resolver = zodResolver(
      z.object({
          email: z.string().email(),
          password: z.string().min(6)
      })
  );
  </script>

  <template>
      <Form :resolver="resolver" @submit="onSubmit">
          <SharedAppFormField name="email" :label="$t('login.email')" id="email">
              <InputText id="email" type="email" fluid />
          </SharedAppFormField>
      </Form>
  </template>
  ```

## Конвенції

- Текст інтерфейсу українською мовою
- Тексти інтерфейсу виносити у файли локалізації (`i18n/locales/ua.json`), у шаблонах використовувати `$t('key')` або `useI18n()` composable
- Сторінки вказують лейаут через `definePageMeta({ layout: 'layoutName' })`

## Оновлення інструкцій

При внесенні змін до проєкту (нові модулі, зміна архітектури, нові конвенції, зміна конфігурації) необхідно оновити цей файл CLAUDE.md відповідно до внесених змін.
