/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
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

import React, { useState } from 'react'
import { AppRouter } from './AppRouter'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { hot } from 'react-hot-loader/root'
import { ComponentsProvider, MessageBar } from '@looker/components'

/**
 * Extension that implements a simple check to grant access to an extension
 * using and extension access key.
 *
 * Note that the extension developer must provide an external API endpoint
 * that validates the access key. The access key itself is encrypted and stored
 * in Looker user attributes.
 *
 * A simple express server is provided with this demo that validates the
 * access key and returns a JWT token that can be used on subsequent
 * requests. Note that the implementation is simplistic and is not
 * considered to production ready. It is just provided to show how
 * a access key check could be implemented for an extension.
 */

/**
 * Scene props extend these props. Message state is held
 * in this component. Scenes can update the message state
 * via these functions
 */
export interface MessageHandlerProps {
  /**
   * Displays a critical message
   */
  updateCriticalMessage: (message: string) => void
  /**
   * Displays a positive message
   */
  updatePositiveMessage: (message: string) => void
  /**
   * Clears any message that is displayed
   */
  clearMessage: () => void
}

/**
 * URL for data server
 */
export const DATA_SERVER_URL =
  process.env.DATA_SERVER_URL || 'http://127.0.0.1:3000'

/**
 * Access key name suffix used to store the access key in
 * looker user attributes. Note that the user attrbute name
 * is the extension id where '::' is replaced with '_' with
 * a suffix of '_' and the ACCESS_KEy_NAME. Example
 * access_key_demo_access_key_demo_access_key
 */
export const ACCESS_KEY_NAME = 'access_key'

/**
 * The acess key demo application
 */
export const App: React.FC<{}> = hot(() => {
  const [route, setRoute] = useState('')
  const [routeState, setRouteState] = useState()

  const onRouteChange = (route: string, routeState?: any) => {
    setRoute(route)
    setRouteState(routeState)
  }
  // Message state, intent and message
  const [intent, setIntent] = useState<'critical' | 'positive'>()
  const [message, setMessage] = useState<string>()

  /**
   * Clears any message that is displayed
   */
  const clearMessage = () => {
    setIntent(undefined)
    setMessage(undefined)
  }

  /**
   * Displays a critical message
   */
  const updateCriticalMessage = (message: string) => {
    setIntent('critical')
    setMessage(message)
  }

  /**
   * Displays a positive message
   */
  const updatePositiveMessage = (message: string) => {
    setIntent('positive')
    setMessage(message)
  }

  return (
    <ExtensionProvider
      onRouteChange={onRouteChange}
      requiredLookerVersion=">=7.10.0"
    >
      <ComponentsProvider>
        {message && intent && (
          <MessageBar intent={intent} onPrimaryClick={clearMessage}>
            {message}
          </MessageBar>
        )}
        <AppRouter
          updateCriticalMessage={updateCriticalMessage}
          updatePositiveMessage={updatePositiveMessage}
          clearMessage={clearMessage}
        />
      </ComponentsProvider>
    </ExtensionProvider>
  )
})
