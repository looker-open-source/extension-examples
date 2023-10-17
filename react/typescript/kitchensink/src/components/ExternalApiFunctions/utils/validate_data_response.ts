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
import type { Dispatch } from 'react'
import type { FetchProxyDataResponse } from '@looker/extension-sdk'
import { extractMessageFromError } from '../../../utils'
import { updateErrorMessage } from '../data/DataReducer'

/**
 * Utility method to handle responses from the data server. Will log the user out
 * if a 401 response is returned.
 * @param response
 * @param dataDispatch
 * @param errorMessage
 */
export const handleResponse = (
  response: FetchProxyDataResponse,
  dataDispatch: Dispatch<any>,
  errorMessage = 'Unexpected error. Has the data server been started? npm run start-data-server',
  firstTime = false
): boolean => {
  const { ok, status } = response
  if (ok) {
    if (!firstTime) {
      updateErrorMessage(dataDispatch, undefined)
    }
    return true
  } else {
    if (status === 401) {
      updateErrorMessage(dataDispatch, 'Token expired!')
    } else {
      updateErrorMessage(dataDispatch, errorMessage)
    }
    return false
  }
}

/**
 * Standard error handling for data server response. Parses out the error messages and
 * provides feed to user if environment has not been setup correctly (for example
 * data server not running).
 * @param error
 * @param dataDispatch
 * @param firstTime
 */
export const handleError = (
  error: any,
  dataDispatch: Dispatch<any>,
  firstTime = false
) => {
  console.error(error)
  const errorMessage = extractMessageFromError(error)
  if (errorMessage.startsWith('Extension not entitled to access external ')) {
    updateErrorMessage(dataDispatch, errorMessage)
  } else if (errorMessage.startsWith('Required Looker version ')) {
    updateErrorMessage(
      dataDispatch,
      'This version of Looker does not support external API functions'
    )
  } else if (errorMessage.startsWith('Entitlements must be defined')) {
    updateErrorMessage(
      dataDispatch,
      'Entitlements must be defined to use external API functionality'
    )
  } else if (firstTime) {
    updateErrorMessage(
      dataDispatch,
      'Has the data server been started? npm run start-data-server'
    )
  } else {
    updateErrorMessage(
      dataDispatch,
      `An unexpected error occured: ${errorMessage}`
    )
  }
}
