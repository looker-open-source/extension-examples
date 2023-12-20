/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import fs from 'fs'

const packages = {
  '@looker/components': '5.0.3',
  '@looker/components-providers': '1.5.34',
  '@looker/components-test-utils': '1.5.27',
  '@looker/i18n': '1.0.0',
  '@looker/design-tokens': '3.1.1',
  '@looker/embed-sdk': '^1.8.5',
  '@looker/extension-sdk': '23.20.1',
  '@looker/extension-sdk-react': '23.20.1',
  '@looker/icons': '1.5.21',
  '@looker/sdk': '23.20.1',
  '@looker/sdk-rtl': '21.6.1',
  react: '^16.14.0',
  'react-content-loader': '^4.0.1',
  'react-dom': '^16.14.0',
  'react-grid-layout': '^1.2.5',
  'react-helmet-async': '^1.0.9',
  'react-highlight-words': '^0.16.0',
  'react-hotkeys-hook': '^2.3.1',
  'react-i18next': '^11.8.15',
  'react-infinite-scroll-component': '^5.0.4',
  'react-intersection-observer': '^8.31.0',
  'react-is': '^16.13.1',
  'react-markdown': '^6.0.3',
  'react-moment': '^1.1.1',
  'react-player': '^2.9.0',
  'react-query': '^3.5.12',
  'react-redux': '^7.1.1',
  'react-router': '^5.2.1',
  'react-router-dom': '^5.3.0',
  'react-sortable-hoc': '^1.11.0',
  'react-test-renderer': '^16.14.0',
  'regenerator-runtime': '0.12.1',
  'resize-observer-polyfill': '^1.5.1',
  redux: '^4.0.1',
  'redux-devtools-extension': '^2.13.8',
  'redux-mock-store': '^1.5.3',
  'redux-saga': '^1.1.3',
  'redux-thunk': '^2.4.1',
  'styled-components': '5.3.1',
  enzyme: '^3.10.0',
  'enzyme-adapter-react-16': '^1.15.1',
  'eslint-plugin-cypress': '^2.12.1',
  'eslint-plugin-header': '^3.1.1',
  'eslint-plugin-jest': '^25.3.0',
  'eslint-plugin-node': '^11.1.0',
  'eslint-plugin-prettier': '^4.0.0',
  'event-hooks-webpack-plugin': '^2.2.0',
  "@looker/prettier-config": "^0.10.4",
  "@typescript-eslint/eslint-plugin": "5.20.0",
  "@typescript-eslint/parser": "5.20.0",
  "eslint": "8.13.0",
  "eslint-config-prettier": "8.5.0",
  "eslint-config-standard": "17.0.0",
  "eslint-import-resolver-typescript": "2.7.1",
  "eslint-import-resolver-webpack": "0.13.2",
  "eslint-plugin-i18next": "5.1.2",
  "eslint-plugin-import": "2.26.0",
  "eslint-plugin-jest-dom": "4.0.3",
  "eslint-plugin-lodash": "7.4.0",
  "eslint-plugin-mdx": "2.2.0",
  "eslint-plugin-n": "15.2.4",
  "eslint-plugin-promise": "6.0.0",
  "eslint-plugin-react": "7.29.4",
  "eslint-plugin-react-hooks": "4.4.0",
  "eslint-plugin-sort-keys-fix": "1.1.2",
  "eslint-plugin-testing-library": "5.3.1",
  "eslint-plugin-unicorn": "44.0.2",
  "prettier": "2.8.2",
  "typescript": "4.6.3",
  jest: '^26.6.3',
  'jest-axe': '^4.1.0',
  'jest-canvas-mock': '^2.2.0',
  'jest-codemods': '^0.15.0',
  'jest-environment-jsdom': '^26.6.2',
  'jest-fetch-mock': '^2.1.2',
  'jest-html-reporters': '^1.2.1',
  'jest-junit': '^12.1.0',
  'jest-styled-components': '^7.0.3',
  webpack: '^5.67.0',
  'webpack-bundle-analyzer': '4.9.0',
  'webpack-cli': '5.1.4',
  'webpack-merge': '5.88.2',
  'webpack-subresource-integrity': '5.1.0',
  'webpack-dev-server': '^4.15.1',
  'prettier-check': '^2.0.0',
  '@styled-icons/material': '^10.28.0',
  '@styled-icons/material-outlined': '^10.34.0',
  '@styled-icons/material-rounded': '^10.34.0',
  '@babel/cli': '7.17.6',
  '@babel/core': '7.22.1',
  '@babel/eslint-parser': '7.21.8',
  '@babel/plugin-transform-runtime': '7.22.4',
  '@babel/preset-env': '7.22.4',
  '@babel/preset-react': '^7.22.3',
  '@babel/preset-typescript': '^7.21.5',
  '@babel/runtime-corejs3': '^7.22.3',
  '@types/styled-components': '^5.1.13',
  '@types/styled-system': '^5.1.13',
  '@types/styled-system__props': '^5.1.1',
  '@types/styled-system__should-forward-prop': '^5.1.2',
  axios: '^0.21.2',
  d3: '^7.8.5',
  '@looker/eslint-config-oss': '^1.7.14',
  lodash: '^4.17.21',
  semver: '^7.5.4',
  ssf: '^0.11.2',
  'json-server': '^0.17.4',
  'jsonwebtoken': '^9.0.2',
  '@testing-library/jest-dom': '^5.16.5',
  '@testing-library/react': '^11.2.2',
  '@testing-library/user-event': '^12.6.0',
}

const isIgnorable = (fileName: string) => {
  const ignoreDirs = [
    'node_modules',
    '.git',
    '..',
    '.',
  ]
  return ignoreDirs.includes(fileName)
}

const findPackageFiles = (dirName: string, packageFiles: string[]) => {
  const files = fs.readdirSync(dirName)
  files.forEach((fileName) => {
    if (!isIgnorable(fileName)) {
      const name = `${dirName}/${fileName}`
      if (fs.lstatSync(name).isDirectory()) {
        findPackageFiles(name, packageFiles)
      } else if (fileName === 'package.json') {
        packageFiles.push(name)
      }
    }
  })
}

const updateContent = (lines: string[]) => {
  let packageSection = false
  let updated = false
  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    if (packageSection) {
      if (trimmedLine.startsWith('}')) {
        packageSection = false
      } else {
        const [packageName, version] = trimmedLine
          .replace(/\"/g, '')
          .replace(': ', ':')
          .replace(',', '')
          .split(':')
        if (packages[packageName] && packages[packageName] !== version) {
          const newLine = `${line.split('"')[0]}"${packageName}": "${
            packages[packageName]
          }"${trimmedLine.endsWith(',') ? ',' : ''}`
          lines[index] = newLine
          updated = true
        }
      }
    } else {
      if (
        trimmedLine.startsWith('"dependencies"') ||
        trimmedLine.startsWith('"devDependencies"')
      ) {
        packageSection = true
      }
    }
  })
  return updated
}

const updatePackageFile = (packageFileName: string) => {
  let rawdata = fs.readFileSync(packageFileName, { encoding: 'utf-8' })
  const lines = rawdata.split('\n')
  if (updateContent(lines)) {
    fs.writeFileSync(packageFileName, lines.join('\n'))
  }
}

const updatePackages = () => {
  console.log(process.cwd())
  const files: string[] = []
  findPackageFiles('.', files)
  files.forEach((packageFileName) => updatePackageFile(packageFileName))
}

updatePackages()
