const globals = require('globals');
const pluginJs = require('@eslint/js');
const tseslint = require('typescript-eslint');
const pluginPrettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['node_modules', 'dist', 'generated', 'eslint.config.js'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginPrettier,
  {
    rules: {
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-unused-expressions': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'error',
      'no-console': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
