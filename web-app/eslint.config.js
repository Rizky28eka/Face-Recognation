import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['resources/js/**/*.{ts,tsx}'],
        languageOptions: {
            parser: typescriptParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                route: 'readonly',
                axios: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            react: react,
            'react-hooks': reactHooks,
            prettier: prettier,
        },
        rules: {
            // TypeScript rules
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            
            // React rules
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'no-undef': 'off', // Handle 'React' is not defined errors in JSX
            
            // React Hooks rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            
            // Prettier rules
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                    semi: true,
                    singleQuote: true,
                    tabWidth: 4,
                    trailingComma: 'all',
                },
            ],
            ...prettierConfig.rules,
            'no-unused-vars': 'off', // Soften for shadcn generated code
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
