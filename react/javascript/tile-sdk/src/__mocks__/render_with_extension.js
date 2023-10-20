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

import React from 'react'
import { renderWithTheme } from '@looker/components-test-utils'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { registerHostApi } from '@looker/extension-sdk'
import 'regenerator-runtime/runtime'
import ResizeObserver from 'resize-observer-polyfill'

global.ResizeObserver = ResizeObserver

const getTileHostData = () => {
  return {
    isExploring: false,
    dashboardId: '42',
    elementId: '84',
    queryId: '168',
    querySlug: 'ABCDEFG',
    dashboardFilters: {
      state: 'CA',
    },
    dashboardRunState: 'NOT_RUNNING',
    isDashboardEditing: false,
    isDashboardCrossFilteringEnabled: false,
    filteredQuery: undefined,
    lastRunSourceElementId: undefined,
    lastRunStartTime: undefined,
    lastRunEndTime: undefined,
    lastRunSuccess: true,
  }
}

const getTileSdk = (tileHostData) => {
  return {
    tileHostData,
  }
}

const getExtensionSDK = (extensionSDKOverride) => {
  const extensionSDK = {
    error: () => {
      // noop
    },
    rendered: () => {
      // noop
    },
    lookerHostData: {},
    ...extensionSDKOverride,
  }
  registerHostApi(extensionSDK)
  return extensionSDK
}

const getExtensionContext = (
  extensionSDKOverride,
  tileHostDataOverride,
  tileSDKOverride,
  contextOverride
) => {
  const tileHostData = {
    ...getTileHostData(),
    ...tileHostDataOverride,
  }
  return {
    coreSDK: {},
    extensionSDK: getExtensionSDK(extensionSDKOverride),
    route: '',
    tileHostData,
    tileSDK: {
      ...getTileSdk(tileHostData),
      ...tileSDKOverride,
    },
    ...contextOverride,
  }
}

const withExtensionContext40 = (
  consumer,
  extensionSDKOverride,
  tileHostDataOverride,
  tileSDKOverride,
  contextOverride
) => (
  <ExtensionContext40.Provider
    value={getExtensionContext(
      extensionSDKOverride,
      tileHostDataOverride,
      tileSDKOverride,
      contextOverride
    )}
  >
    {consumer}
  </ExtensionContext40.Provider>
)

export const renderWithExtensionContext40 = (
  component,
  extensionSDKOverride = {},
  tileHostDataOverride = {},
  tileSDKOverride = {},
  contextOverride = {}
) =>
  renderWithTheme(
    withExtensionContext40(
      component,
      extensionSDKOverride,
      tileHostDataOverride,
      tileSDKOverride,
      contextOverride
    )
  )
