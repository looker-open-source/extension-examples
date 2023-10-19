const { off } = require('process')

module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:jest-dom/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:testing-library/react',
    'prettier',
    '@looker/eslint-config-oss',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'jest',
    'jest-dom',
    'prettier',
    'react-hooks',
    'sort-keys-fix',
    'testing-library',
  ],
  rules: {
    'no-console': [
      'error',
      {
        allow: ['info', 'warn', 'error'],
      },
    ],
    '@typescript-eslint/no-empty-function': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'sort-keys-fix/sort-keys-fix': 'off',
    camelcase: 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
