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

import React, { useState, useContext } from 'react'
import {
  Space,
  ComponentsProvider,
  Button,
  SpaceVertical,
  MessageBar,
} from '@looker/components'
import { Sheets } from './components/Sheets'
import { OauthContext } from './components/OauthProvider'

/**
 * Application that demonstrates how to create and update a Google
 * spreadsheet.
 */
export const DemoExternalApi = () => {
  const { loggingIn, token, signIn, signOut } = useContext(OauthContext)
  const [message, setMessage] = useState()

  const onSignInOutClick = () => {
    if (token) {
      signOut()
    } else {
      signIn()
    }
  }

  const updateMessage = (text, intent = 'critical') => {
    if (!message || text !== message.text || intent !== message.intent) {
      setMessage({ intent, text })
    }
  }

  const clearMessage = () => {
    if (message) {
      setMessage()
    }
  }

  return (
    <ComponentsProvider
      themeCustomizations={{
        colors: { key: '#1A73E8' },
      }}
    >
      <SpaceVertical>
        <Space reverse>
          <Button onClick={onSignInOutClick} disabled={loggingIn}>
            {token ? 'Signout' : ' Signin'}
          </Button>
        </Space>
        {message && (
          <MessageBar intent={message.intent}>{message.text}</MessageBar>
        )}
        {token && (
          <Sheets
            token={token}
            signOut={signOut}
            updateMessage={updateMessage}
            clearMessage={clearMessage}
          />
        )}
      </SpaceVertical>
    </ComponentsProvider>
  )
}
