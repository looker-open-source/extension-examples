/*

 MIT License

 Copyright (c) 2023 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

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
