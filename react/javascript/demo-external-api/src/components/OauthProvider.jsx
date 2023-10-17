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
import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { ExtensionContext40 } from '@looker/extension-sdk-react'

export const OauthContext = createContext({})

const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

/**
 * Default push state handler.
 * props object has one or two properties
 * state - always present and represents current state
 * token - only present for login and logout
 *       - login - valid token
 *       - logout - always undefined
 * Push state handler gets called on three occassions
 * 1. to get the current token - no token so get from state
 * 2. to login - token property present so add token to state
 * 3. to logout - token property present but undefined - remove from state.
 */
const defaultPushStateHandler = (props) => {
  const { token, state } = props
  return Object.prototype.hasOwnProperty.call(props, 'token') ? token : state
}

/**
 * Oauth provider that stores an OAUTH2 access token in history push state.
 * This example uses Googles implicit OAUTH2 flow.
 */
export const OauthProvider = ({
  children,
  clientId,
  scopes,
  pushStateHandler = defaultPushStateHandler,
  loggedInRoute = '/home',
  loggedOutRoute = '/',
}) => {
  const { extensionSDK } = useContext(ExtensionContext40)
  const [loggingIn, setLoggingIn] = useState(false)
  const history = useHistory()
  const { state } = useLocation()
  const token = pushStateHandler({ state })

  /**
   * OAUTH2 authentication.
   */
  const signIn = async () => {
    try {
      setLoggingIn(true)
      const response = await extensionSDK.oauth2Authenticate(authUrl, {
        client_id: clientId,
        response_type: 'token',
        scope: scopes,
      })
      const { access_token } = response
      history.push(
        loggedInRoute,
        // eslint-disable-next-line camelcase
        pushStateHandler({ state, token: access_token })
      )
      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setLoggingIn(false)
    }
  }

  /**
   * Simplistic sign out of the user.
   * Removes the token from push state. Note that the token is
   * still active if it has not already expired.
   */
  const signOut = () => {
    history.push(loggedOutRoute, pushStateHandler({ state, token: undefined }))
  }

  return (
    <OauthContext.Provider value={{ loggingIn, signIn, signOut, token }}>
      {children}
    </OauthContext.Provider>
  )
}

OauthProvider.propTypes = {
  children: PropTypes.object,
  clientId: PropTypes.string.isRequired,
  loggedInRoute: PropTypes.string,
  loggedOutRoute: PropTypes.string,
  pushStateHandler: PropTypes.func,
  scopes: PropTypes.string.isRequired,
}
