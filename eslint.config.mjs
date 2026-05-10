import withNuxt from './.nuxt/eslint.config.mjs';
import eslintConfigPrettier from 'eslint-config-prettier';

export default withNuxt(
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-extraneous-class': 'off'
        }
    },
    {
        files: ['**/*.{vue}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'vue/attributes-order': 'off',
            'vue/html-indent': [
                'error',
                4,
                {
                    attribute: 1,
                    baseIndent: 1,
                    closeBracket: 0,
                    alignAttributesVertically: true,
                    ignores: []
                }
            ]
        }
    },
    eslintConfigPrettier
);
