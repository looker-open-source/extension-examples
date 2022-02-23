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
  '@looker/components': '^3.0.1',
  '@looker/components-date': '^2.4.1',
  '@looker/components-providers': '^1.5.19',
  '@looker/design-tokens': '^2.7.1',
  '@looker/embed-sdk': '^1.6.1',
  '@looker/extension-sdk': '^22.2.0',
  '@looker/extension-sdk-react': '^22.2.0',
  '@looker/icons': '1.5.13',
  '@looker/sdk': '^22.2.0',
  '@looker/sdk-rtl': '^21.3.2',
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
  redux: '^4.0.1',
  'redux-devtools-extension': '^2.13.8',
  'redux-mock-store': '^1.5.3',
  'redux-saga': '^1.1.3',
  'redux-thunk': '^2.4.1',
  'styled-components': '^5.3.1',
  typescript: '^4.5.2',
  enzyme: '^3.10.0',
  'enzyme-adapter-react-16': '^1.15.1',
  eslint: '^7.32.0',
  'eslint-config-prettier': '^8.3.0',
  'eslint-config-standard': '^16.0.3',
  'eslint-plugin-cypress': '^2.12.1',
  'eslint-plugin-header': '^3.1.1',
  'eslint-plugin-i18next': '^5.1.2',
  'eslint-plugin-import': '^2.25.3',
  'eslint-plugin-jest': '^25.3.0',
  'eslint-plugin-jest-dom': '^4.0.0',
  'eslint-plugin-lodash': '^7.3.0',
  'eslint-plugin-mdx': '^1.16.0',
  'eslint-plugin-node': '^11.1.0',
  'eslint-plugin-prettier': '^4.0.0',
  'eslint-plugin-promise': '^6.0.0',
  'eslint-plugin-react': '^7.27.0',
  'eslint-plugin-react-hooks': '^4.3.0',
  'eslint-plugin-sort-keys-fix': '^1.1.2',
  'eslint-plugin-testing-library': '^5.0.1',
  'event-hooks-webpack-plugin': '^2.2.0',
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
  'webpack-bundle-analyzer': '^4.5.0',
  'webpack-cli': '^4.9.1',
  'webpack-merge': '^5.8.0',
  'webpack-subresource-integrity': '^5.1.0',
  prettier: '^2.2.1',
  'prettier-check': '^2.0.0',
  '@styled-icons/material': '^10.28.0',
  '@styled-icons/material-outlined': '^10.34.0',
  '@styled-icons/material-rounded': '^10.34.0',
  '@babel/cli': '^7.16.0',
  '@babel/core': '^7.16.0',
  '@babel/eslint-parser': '^7.16.5',
  '@babel/plugin-transform-runtime': '^7.16.4',
  '@babel/preset-env': '^7.16.4',
  '@babel/preset-react': '^7.16.0',
  '@babel/preset-typescript': '^7.16.0',
  '@babel/runtime-corejs3': '^7.16.3',
  '@types/styled-components': '^5.1.13',
  '@types/styled-system': '^5.1.13',
  axios: '^0.21.2',
  '@looker/eslint-config-oss': '^1.7.14',
  lodash: '^4.17.21',
  'webpack-dev-server': '^4.7.4',
}

const isIgnorable = (fileName: string) => {
  const ignoreDirs = ['node_modules', '.git', '..', '.']
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
