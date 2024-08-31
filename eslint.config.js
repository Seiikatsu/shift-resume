import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintReact from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: [
    'node_modules/**',
    'build/**',
    // external components - we should not modify them in order to keep them easy to update
    'src/components/shadcn/**',
    'eslint.config.js',
    'postcss.config.js',
  ],
  extends: [
    // eslint base
    eslint.configs.recommended,

    // add typescript
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    // custom plugins below
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    // eslintReact.configs.recommended,
    // hooksPlugin.configs.recommended,
    jsxA11y.flatConfigs.recommended,
  ],
  plugins: {
    react: eslintReact,
    'react-hooks': hooksPlugin,
  },
  rules: {
    // temporary solution until hooks plugin is compatible with flat configs: https://github.com/facebook/react/issues/28313
    ...eslintReact.configs.recommended.rules,
    ...eslintReact.configs['jsx-runtime'].rules,
    ...hooksPlugin.configs.recommended.rules,

    // adjusted eslint rules
    curly: 'error',
    'no-console': 'warn',
    'no-nested-ternary': 'warn',


    // tslint rules
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/restrict-template-expressions': ['error', {
      allowNumber: true,
      allowAny: false,
      allowArray: false,
      allowBoolean: false,
      allowNever: false,
      allowNullish: false,
      allowRegExp: false,
    }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'args': 'all',
        'argsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }
    ],
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',


    // plugin rules
    'import-x/no-cycle': 'error',
    'import-x/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          ['sibling', 'index'],
        ],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
          },
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    'jsx-a11y/label-has-associated-control': 'off',

    'react/prop-types': 'off',
  },
  languageOptions: {
    parserOptions: {
      project: true,
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    }
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import-x/resolver': {
      typescript: {
        typescript: true,
        node: true,
      },
    },
  },
});
