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
import React, { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { ExtensionContext40 } from '@looker/extension-sdk-react'

export const OauthContext = createContext({})

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleScopes = 'https://www.googleapis.com/auth/spreadsheets'
const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
const auth0ClientId = process.env.AUTH0_CLIENT_ID
const auth0BaseUrl = process.env.AUTH0_BASE_URL
const auth0AuthUrl = `${auth0BaseUrl}/authorize`
const auth0Scopes = 'openid profile email'

const loggedInRoute = '/home'
const loggedOutRoute = '/'
const localStorageTokenName = 'access_token'

const validAuthProviders = ['google', 'auth0']

/**
 * Oauth provider that stores an OAUTH2 access token in history push state.
 * This example uses Googles implicit OAUTH2 flow.
 */
export const OauthProvider = ({ children }) => {
  const { extensionSDK } = useContext(ExtensionContext40)
  const [oauthProvider, setOauthProvider] = useState()
  const [loggingIn, setLoggingIn] = useState(true)
  const history = useHistory()
  const { state } = useLocation()
  const [token, setToken] = useState()

  useEffect(() => {
    const initialize = async () => {
      let provider
      try {
        provider = await extensionSDK.userAttributeGetItem('oauth_provider')
        if (!validAuthProviders.includes(provider)) {
          provider = validAuthProviders[0]
        }
      } catch (error) {
        provider = validAuthProviders[0]
      }
      setOauthProvider(provider)
      const localStorageToken = await extensionSDK.localStorageGetItem(
        localStorageTokenName
      )
      if (localStorageToken) {
        setToken(localStorageToken)
        setLoggingIn(false)
      } else {
        if (provider === validAuthProviders[0]) {
          signInGoogle()
        } else {
          signInAuth0()
        }
      }
    }
    initialize()
  }, [])

  const signInGoogle = async () => {
    try {
      setLoggingIn(true)
      const response = await extensionSDK.oauth2Authenticate(googleAuthUrl, {
        client_id: googleClientId,
        response_type: 'token',
        scope: googleScopes,
      })
      const { access_token } = response
      await extensionSDK.localStorageSetItem(
        localStorageTokenName,
        access_token
      )
      setToken(access_token)
      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setLoggingIn(false)
    }
  }

  const getGoogleToken = (body = {}) => {
    const { identities } = body
    if (identities.length) {
      const googleIdentity = identities.find(
        (identity) => identity === 'google-oauth2'
      )
      if (googleIdentity) {
        return googleIdentity.access_token
      }
    }
    return undefined
  }

  const signInAuth0 = async () => {
    try {
      setLoggingIn(true)

      const authRequest = {
        client_id: auth0ClientId,
        code_challenge_method: 'S256',
        response_type: 'code',
        scope: auth0Scopes,
      }
      const response = await extensionSDK.oauth2Authenticate(
        auth0AuthUrl,
        authRequest,
        'GET'
      )
      const exchangeRequest = {
        client_id: auth0ClientId,
        code: response.code,
        grant_type: 'authorization_code',
      }

      const codeExchangeResponse =
        await extensionSDK.oauth2ExchangeCodeForToken(
          `${auth0BaseUrl}/login/oauth/token`,
          exchangeRequest
        )
      const { access_token, expires_in } = codeExchangeResponse
      await extensionSDK.localStorageSetItem(
        localStorageTokenName,
        access_token
      )
      setToken(access_token)
      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setLoggingIn(false)
    }
  }

  /**
   * OAUTH2 authentication.
   */
  const signIn = () => {
    if (oauthProvider === validAuthProviders[0]) {
      signInGoogle()
    } else {
      signInAuth0()
    }
  }

  /**
   * Simplistic sign out of the user.
   * Removes the token from push state. Note that the token is
   * still active if it has not already expired.
   */
  const signOut = async () => {
    await extensionSDK.localStorageRemoveItem(localStorageTokenName)
    setToken(undefined)
  }

  return (
    <OauthContext.Provider
      value={{ loggingIn, oauthProvider, signIn, signOut, token }}
    >
      {oauthProvider && children}
    </OauthContext.Provider>
  )
}

OauthProvider.propTypes = {
  children: PropTypes.object,
}
