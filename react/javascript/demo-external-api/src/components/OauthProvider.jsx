/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Looker Data Sciences, Inc.
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
import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { ExtensionContext2 } from '@looker/extension-sdk-react'

export const OauthContext = createContext({})

const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

/**
 * Oauth provider
 */
export const OauthProvider = ({ children, clientId, scopes }) => {
  const [loggingIn, setLoggingIn] = useState(false)
  const { state } = useLocation()
  const history = useHistory()
  const { extensionSDK } = useContext(ExtensionContext2)

  /**
   * OAUTH2 authentication
   */
  const signIn = async () => {
    try {
      setLoggingIn(true)
      const response = await extensionSDK.oauth2Authenticate(authUrl, {
        client_id: clientId,
        scope: scopes,
        response_type: 'token',
      })
      // eslint-disable-next-line camelcase
      const { access_token } = response
      history.push('/sheets', access_token)
      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setLoggingIn(false)
    }
  }

  /**
   * Clear the token from push state. Note that the token is
   * still active if it has not already expired.
   */
  const signOut = () => {
    history.push('/', undefined)
  }

  return (
    <OauthContext.Provider value={{ loggingIn, token: state, signIn, signOut }}>
      {children}
    </OauthContext.Provider>
  )
}

OauthProvider.propTypes = {
  children: PropTypes.object,
  clientId: PropTypes.string.isRequired,
  scopes: PropTypes.string.isRequired,
}
