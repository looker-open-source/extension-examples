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

import type { ReactNode } from 'react'
import React from 'react'
import { renderWithTheme } from '@looker/components-test-utils'
import type { RenderResult } from '@testing-library/react'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import type { ExtensionHostApi, ExtensionSDK } from '@looker/extension-sdk'
import { registerHostApi } from '@looker/extension-sdk'
import { MemoryRouter } from 'react-router-dom'
import 'regenerator-runtime/runtime'
import ResizeObserver from 'resize-observer-polyfill'

global.ResizeObserver = ResizeObserver

const getExtensionSDK = (extensionSDKOverride: Partial<ExtensionSDK>) => {
  const extensionSDK = {
    lookerHostData: {},
    error: () => {
      // noop
    },
    ...extensionSDKOverride,
  } as ExtensionHostApi
  registerHostApi(extensionSDK)
  return extensionSDK
}

const getExtensionContext40 = (
  extensionSDKOverride: Partial<ExtensionSDK>,
  contextOverride: Partial<ExtensionContextData40>
): ExtensionContextData40 =>
  ({
    extensionSDK: getExtensionSDK(extensionSDKOverride),
    coreSDK: {},
    route: '',
    ...contextOverride,
  } as ExtensionContextData40)

const withExtensionContext40 = (
  component: ReactNode,
  extensionSDKOverride: Partial<ExtensionSDK>,
  contextOverride: Partial<ExtensionContextData40>
) => (
  <MemoryRouter>
    <ExtensionContext40.Provider
      value={getExtensionContext40(extensionSDKOverride, contextOverride)}
    >
      {component}
    </ExtensionContext40.Provider>
  </MemoryRouter>
)

export const renderWithExtensionContext40 = (
  component: ReactNode,
  extensionSDKOverride = {},
  contextOverride = {}
): RenderResult =>
  renderWithTheme(
    withExtensionContext40(component, extensionSDKOverride, contextOverride)
  )
