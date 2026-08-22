import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/vue3-vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
    stories: [
        '../stories/**/*.mdx',
        '../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
        '../app/components/**/*.stories.@(js|jsx|ts|tsx|mdx)'
    ],
    addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
    framework: '@storybook/vue3-vite',
    viteFinal(config) {
        config.plugins = config.plugins || [];
        config.plugins.push(
            vue(),
            tailwindcss(),
            AutoImport({
                imports: [
                    'vue',
                    'vue-router',
                    'vue-i18n',
                    { [path.resolve(__dirname, 'mocks')]: ['useSidebar'] }
                ]
            })
        );
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...config.resolve.alias,
            '~': path.resolve(__dirname, '../app')
        };
        return config;
    }
};
export default config;
