/*

 MIT License

 Copyright (c) 2022 Looker Data Sciences, Inc.

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

import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { renderWithTheme } from '@looker/components-test-utils'
import {
  ExtensionContext2,
  ExtensionContext,
} from '@looker/extension-sdk-react'
import { registerHostApi } from '@looker/extension-sdk'
import { OauthContext } from '../components/OauthProvider'
import { SheetsContext } from '../components/SheetsProvider'

const getExtensionSDK = (extensionSDKOverride) => {
  const extensionSDK = {
    error: () => {
      // noop
    },
    lookerHostData: {},
    ...extensionSDKOverride,
  }
  registerHostApi(extensionSDK)
  return extensionSDK
}

const getExtensionContext = (extensionSDKOverride, contextOverride) => ({
  coreSDK: {},
  extensionSDK: getExtensionSDK(extensionSDKOverride),
  route: '',
  ...contextOverride,
})

const withExtensionContext2 = (
  component,
  extensionSDKOverride,
  contextOverride
) => (
  <MemoryRouter>
    <ExtensionContext2.Provider
      value={getExtensionContext(extensionSDKOverride, contextOverride)}
    >
      <OauthContext.Provider value={{}}>
        <SheetsContext.Provider value={{}}>{component}</SheetsContext.Provider>
      </OauthContext.Provider>
    </ExtensionContext2.Provider>
  </MemoryRouter>
)

export const renderWithExtensionContext2 = (
  component,
  extensionSDKOverride = {},
  contextOverride = {}
) =>
  renderWithTheme(
    withExtensionContext2(component, extensionSDKOverride, contextOverride)
  )

const withExtensionContext = (
  component,
  extensionSDKOverride,
  contextOverride
) => (
  <MemoryRouter>
    <ExtensionContext.Provider
      value={getExtensionContext(extensionSDKOverride, contextOverride)}
    >
      {component}
    </ExtensionContext.Provider>
  </MemoryRouter>
)

export const renderWithExtensionContext = (
  component,
  extensionSDKOverride = {},
  contextOverride = {}
) =>
  renderWithTheme(
    withExtensionContext(component, extensionSDKOverride, contextOverride)
  )
