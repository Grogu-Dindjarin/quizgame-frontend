import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  prettier,
  {
    plugins: {
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^node:', '^react', '^(?!\\.)'],
            ['^src/'],
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'func-style': ['error', 'expression'],
      'object-shorthand': 'error',
      'no-duplicate-imports': 'error',
      'prefer-arrow-callback': 'error',
      'no-useless-return': 'error',
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
];
