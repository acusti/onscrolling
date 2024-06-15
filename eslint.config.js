import jsPlugin from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import cypressPlugin from 'eslint-plugin-cypress';
import deprecationPlugin from 'eslint-plugin-deprecation';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jestDOMPlugin from 'eslint-plugin-jest-dom';
import markdownPlugin from 'eslint-plugin-markdown';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import tsSortKeysPlugin from 'eslint-plugin-typescript-sort-keys';
import globals from 'globals';

export default [
    jsPlugin.configs.recommended,
    prettierConfig,
    // Global ignores
    {
        ignores: ['dist/', 'public/'],
    },

    // General rules
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'no-shadow': 'error',
            'prefer-const': ['error', { destructuring: 'all' }],
            'sort-keys': 'warn',
        },
    },

    // Plugin Import
    // source: https://github.com/import-js/eslint-plugin-import/issues/2556#issuecomment-1419518561
    {
        languageOptions: {
            parserOptions: {
                // Eslint doesn't supply ecmaVersion in `parser.js` `context.parserOptions`
                // This is required to avoid ecmaVersion < 2015 error or 'import' / 'export' error
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: { import: importPlugin },
        rules: {
            ...importPlugin.configs.recommended.rules,
            // TODO enable this once https://github.com/import-js/eslint-plugin-import/pull/2813 is merged + published
            // 'import/extensions': ['error', 'ignorePackages'],
            'import/order': [
                'error',
                {
                    alphabetize: { caseInsensitive: true, order: 'asc' },
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                    ],
                    'newlines-between': 'always',
                },
            ],
        },
        settings: {
            'import/internal-regex': '^~/',
            'import/parsers': {
                espree: ['.js', '.cjs', '.mjs', '.jsx'],
            },
            'import/resolver': {
                node: { extensions: ['.ts', '.tsx'] },
                typescript: { alwaysTryTypes: true },
            },
        },
    },

    // Typescript
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: { project: ['./tsconfig.json'] },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            deprecation: deprecationPlugin,
            import: importPlugin,
            'typescript-sort-keys': tsSortKeysPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...tsPlugin.configs.stylistic.rules,
            ...deprecationPlugin.configs.recommended.rules,
            ...importPlugin.configs.recommended.rules,
            ...importPlugin.configs.typescript.rules,
            ...tsSortKeysPlugin.configs.recommended.rules,
            '@typescript-eslint/array-type': ['error', { default: 'generic' }],
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/prefer-nullish-coalescing': [
                'error',
                { ignorePrimitives: { boolean: true, string: true } },
            ],
            '@typescript-eslint/strict-boolean-expressions': [
                'error',
                { allowNullableBoolean: true, allowNullableString: true },
            ],
        },
    },

    // Markdown
    {
        files: ['**/*.md'],
        plugins: { markdown: markdownPlugin },
        processor: 'markdown/markdown',
        // The markdown plugin exposes three configuration blocks and is supposed
        // to be included as ...markdownPlugin.configs.recommended, but doing so in
        // this config makes it so that issues in markdown code blocks are missed.
        rules: markdownPlugin.configs.recommended[2].rules,
    },

    // Jest/Vitest
    {
        files: ['**/*.test.{js,jsx,ts,tsx}'],
        plugins: {
            jest: jestPlugin,
            'jest-dom': jestDOMPlugin,
            'testing-library': testingLibraryPlugin,
        },
        rules: {
            ...jestPlugin.configs.recommended.rules,
            ...jestDOMPlugin.configs.recommended.rules,
            ...testingLibraryPlugin.configs.react.rules,
        },
        settings: {
            jest: {
                // we're using vitest which has a very similar API to jest
                // (so the linting plugins work nicely), but it means we have to explicitly
                // set the jest version.
                version: 28,
            },
        },
    },

    // Cypress
    {
        files: ['cypress/**/*.ts'],
        plugins: { cypress: cypressPlugin },
        rules: cypressPlugin.configs.recommended.rules,
    },
];
