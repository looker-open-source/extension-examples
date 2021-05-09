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
    '@looker/eslint-config/license-header',
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
  rules: {},
  settings: {
    react: {
      version: 'detect',
    },
  },
}
