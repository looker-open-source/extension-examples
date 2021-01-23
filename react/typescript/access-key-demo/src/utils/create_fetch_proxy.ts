/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Looker Data Sciences, Inc.
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

import {
  ExtensionSDK,
  FetchProxy,
  FetchCustomParameters,
} from '@looker/extension-sdk'

/**
 * Creates a fetch proxy with a bearer token. Centralizes the setup
 * of the fetch call. Note cookies could be used but with the advent
 * of SameSite: none, third party cookies no longer work with servers
 * that do not use SSL.
 */
export const createDataServerFetchProxy = (
  extensionSDK: ExtensionSDK,
  locationState?: any
): FetchProxy => {
  const init: FetchCustomParameters = {}
  if (locationState && locationState.jwt_token) {
    init.headers = {
      Authorization: `Bearer ${locationState.jwt_token}`,
    }
  }
  return extensionSDK.createFetchProxy(undefined, init)
}
