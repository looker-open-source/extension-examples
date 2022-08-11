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

import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { intersects } from 'semver'
import {
  Box,
  Button,
  ButtonOutline,
  Dialog,
  Heading,
  DialogContent,
  SpaceVertical,
  Text,
} from '@looker/components'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import {
  AuthOption,
  POSTS_SERVER_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_SCOPES,
  GITHUB_CLIENT_ID,
  AUTH0_CLIENT_ID,
  AUTH0_SCOPES,
  AUTH0_BASE_URL,
} from '../..'
import {
  initializeState,
  updateErrorMessage,
  updateName,
} from '../../data/DataReducer'
import { extractMessageFromError } from '../../../../utils/extract_message_from_error'
import { getDataServerFetchProxy } from '../../utils/fetch_proxy'
import type { AuthProps } from './types'

/**
 * Authorization component. Monitors whether a user is signed in or not.
 * Provides options for a user to sign in.
 * User can sign in without any authentication.
 * User can sign in using Google OAUTH2
 */
export const Auth: React.FC<AuthProps> = ({ dataState, dataDispatch }) => {
  // Get access to the extension SDK and the looker API SDK.
  const { extensionSDK, coreSDK } =
    useContext<ExtensionContextData40>(ExtensionContext40)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)

  // React router setup
  const history = useHistory()
  const location = useLocation<any>()

  // Component data state
  const { name } = dataState

  // First time setup
  useEffect(() => {
    const initialize = async () => {
      if (
        GOOGLE_CLIENT_ID === '' ||
        GITHUB_CLIENT_ID === '' ||
        AUTH0_CLIENT_ID === ''
      ) {
        updateErrorMessage(
          dataDispatch,
          'Google, Github or Auth0 client id has not been defined. Please see README.md for instructions.'
        )
        return
      }
      const { authOption, accessToken, jwtToken } = location.state || {}
      if (jwtToken) {
        // Got jwt token, check its still valid
        const isAuthorized = await dataServerAuthCheck()
        if (isAuthorized) {
          // Still valid, repopulate user information
          switch (authOption) {
            case AuthOption.Google:
              getGoogleUserInfo(accessToken)
              break
            case AuthOption.Github:
              getGithubUserInfo(accessToken)
              break
            case AuthOption.Auth0:
              getAuth0UserInfo(accessToken)
              break
            default:
              getLookerUserInfo()
          }
        } else {
          // Not authorized, clear out push state
          history.replace(location.pathname, {})
        }
      }
    }
    initialize()
  }, [])

  // Check to see if the users jwt token is still valid
  const dataServerAuthCheck = async (): Promise<boolean> => {
    try {
      const dataServerFetchProxy = getDataServerFetchProxy(
        extensionSDK,
        location.state
      )
      const response = await dataServerFetchProxy.fetchProxy(
        `${POSTS_SERVER_URL}/auth`
      )
      return response.ok
    } catch (error) {
      console.error(error)
      return false
    }
  }

  // Log the user into to data server using Looker as a proxy. This creates a JWT token
  // that is stored in push state
  // The jwt token is only created if the custom secret resolved by the Looker server
  // matches the secret held by the data server. Essentially, this is a secure exchange
  // of a code (the secret) for an access token (the JWT token).
  const dataServerAuth = async (body: any): Promise<string | undefined> => {
    try {
      // The custom secret will be resolved by the Looker server.
      body.client_secret = extensionSDK.createSecretKeyTag('custom_secret_key')
      const response = await extensionSDK.serverProxy(
        `${POSTS_SERVER_URL}/auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
        }
      )
      if (response.ok && response.body && response.body.jwt_token) {
        return response.body.jwt_token
      }
    } catch (error) {
      console.error(error)
    }
    return undefined
  }

  // Log out of the data server
  const dataServerAuthOut = async (): Promise<void> => {
    try {
      const dataServerFetchProxy = getDataServerFetchProxy(
        extensionSDK,
        location.state
      )
      dataServerFetchProxy.fetchProxy(`${POSTS_SERVER_URL}/authout`)
    } catch (error) {
      console.error(error)
    }
    updateName(dataDispatch, '')
  }

  // Toggle to change authorization. If logged in, the user is logged out.
  // If not logged in, the authorize choice dialog is displayed.
  const changeAuthorization = async () => {
    const { jwtToken } = location.state || {}
    updateErrorMessage(dataDispatch, undefined)
    if (jwtToken) {
      initializeState(dataDispatch)
      await dataServerAuthOut()
      history.replace(location.pathname, {})
    } else {
      setDialogOpen(true)
    }
  }

  // Google login
  const googleSignin = async () => {
    try {
      const response = await extensionSDK.oauth2Authenticate(
        'https://accounts.google.com/o/oauth2/v2/auth',
        {
          client_id: GOOGLE_CLIENT_ID!,
          scope: GOOGLE_SCOPES,
          response_type: 'token',
        }
      )
      const { access_token, expires_in } = response
      // Get information about the just logged in user
      const { id, name } = await getGoogleUserInfo(access_token)
      const jwtToken = await signinDataServer(
        AuthOption.Google,
        id,
        name,
        access_token,
        expires_in
      )
      updateLocationPushState(
        AuthOption.Google,
        jwtToken,
        access_token,
        access_token
      )
    } catch (error) {
      const errorMessage = extractMessageFromError(error)
      if (
        errorMessage.startsWith(
          'Extension not entitled to access external oauth2 API url'
        )
      ) {
        updateErrorMessage(
          dataDispatch,
          "Please add 'https://accounts.google.com/o/oauth2/v2/auth' to the extensions oauth2_urls entitlements"
        )
      } else {
        updateErrorMessage(dataDispatch, 'Login failed')
        console.error('failed to login', error)
      }
    }
  }

  // Get information about user from Google
  const getGoogleUserInfo = async (accessToken?: string) => {
    let name = 'Unknown'
    let id = 'Unknown'
    try {
      // Get information about user from google
      const userInfoResponse = await extensionSDK.fetchProxy(
        `https://www.googleapis.com/oauth2/v2/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (userInfoResponse.ok) {
        name = userInfoResponse.body?.name || 'Unknown'
        id = userInfoResponse.body?.id || 'Unknown'
      }
    } catch (error) {
      const errorMessage = extractMessageFromError(error)
      updateErrorMessage(dataDispatch, errorMessage)
      console.error(error)
    }
    updateName(dataDispatch, name)
    return { id, name }
  }

  // Github login
  const githubSignin = async () => {
    const authenticateParameters: Record<string, string> = {
      client_id: GITHUB_CLIENT_ID!,
      response_type: 'code',
    }
    try {
      const response = await extensionSDK.oauth2Authenticate(
        'https://github.com/login/oauth/authorize',
        authenticateParameters,
        'GET'
      )
      // Note the client secret is securely stored in the Looker server.
      // Do NOT expose the client secret in the extension code.
      // Note github does not support code challenge.
      const exchangeParameters: Record<string, string> = {
        client_id: GITHUB_CLIENT_ID!,
        code: response.code,
        client_secret: extensionSDK.createSecretKeyTag('github_secret_key'),
      }
      const codeExchangeResponse =
        await extensionSDK.oauth2ExchangeCodeForToken(
          'https://github.com/login/oauth/access_token',
          exchangeParameters
        )
      const { access_token, error_description } = codeExchangeResponse
      if (!access_token) {
        updateErrorMessage(
          dataDispatch,
          error_description || 'Authentication failed'
        )
      } else {
        const { id, name } = await getGithubUserInfo(access_token)
        if (!id) {
          updateErrorMessage(
            dataDispatch,
            'Failed to retrieve information about user'
          )
        } else {
          const jwtToken = await signinDataServer(
            AuthOption.Github,
            id,
            name,
            access_token
          )
          updateLocationPushState(AuthOption.Github, jwtToken, access_token)
        }
      }
    } catch (error) {
      const errorMessage = extractMessageFromError(error)
      if (
        errorMessage.startsWith(
          'Extension not entitled to access external oauth2 API url'
        )
      ) {
        updateErrorMessage(
          dataDispatch,
          "Please add 'https://github.com/login/oauth/authorize' and 'https://github.com/login/oauth/access_token' to the extensions oauth2_urls entitlements"
        )
      } else {
        updateErrorMessage(dataDispatch, 'Login failed')
        console.error('failed to login', error)
      }
    }
  }

  // Get information about the use from Github
  const getGithubUserInfo = async (accessToken?: string) => {
    let name
    let id
    try {
      const userInfoResponse = await extensionSDK.fetchProxy(
        'https://api.github.com/user',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (userInfoResponse.ok) {
        name = userInfoResponse.body?.name || 'Unknown'
        id = userInfoResponse.body?.id || 'Unknown'
      }
    } catch (error) {
      const errorMessage = extractMessageFromError(error)
      updateErrorMessage(dataDispatch, errorMessage)
      console.error(error)
    }
    updateName(dataDispatch, name)
    return { id, name }
  }

  // Sigin in using Auth0
  const auth0Signin = async (useCodeChallenge: boolean) => {
    try {
      const authRequest: Record<string, string> = {
        client_id: AUTH0_CLIENT_ID!,
        response_type: 'code',
        scope: AUTH0_SCOPES,
      }
      if (useCodeChallenge) {
        // Alternate method to secret key. The looker host will generate
        // a code challenge and a code verifier. The code challenge is an
        // hashed version of the code verifier. The challenge is sent with
        // the code request, the verifier is sent with the token request.
        // The oauth2 server then hashes the verifier and compares to the
        // code challenge. If they match a token will be returned.
        authRequest.code_challenge_method = 'S256'
      }
      const response = await extensionSDK.oauth2Authenticate(
        `${AUTH0_BASE_URL}/authorize`,
        authRequest,
        'GET'
      )
      const exchangeRequest: Record<string, string> = {
        grant_type: 'authorization_code',
        client_id: AUTH0_CLIENT_ID!,
        code: response.code,
      }
      if (!useCodeChallenge) {
        // Note the client secret is securely stored in the Looker server.
        // Do NOT expose the client secret in the extension code.
        exchangeRequest.client_secret =
          extensionSDK.createSecretKeyTag('auth0_secret_key')
      }

      const codeExchangeResponse =
        await extensionSDK.oauth2ExchangeCodeForToken(
          `${AUTH0_BASE_URL}/login/oauth/token`,
          exchangeRequest
        )
      const { access_token, expires_in } = codeExchangeResponse
      const { id, name } = await getAuth0UserInfo(access_token)
      const jwtToken = await signinDataServer(
        AuthOption.Auth0,
        id,
        name,
        access_token,
        expires_in
      )
      updateLocationPushState(AuthOption.Auth0, jwtToken, access_token)
    } catch (error) {
      const errorMessage = extractMessageFromError(error)
      if (
        errorMessage.startsWith(
          'Extension not entitled to access external oauth2 API url'
        )
      ) {
        updateErrorMessage(
          dataDispatch,
          `Please add '${AUTH0_BASE_URL}/authorize' and '${AUTH0_BASE_URL}/login/oauth/token' to the extensions oauth2_urls entitlements`
        )
      } else {
        updateErrorMessage(dataDispatch, 'Login failed')
        console.error('failed to login', error)
      }
    }
  }

  // Get information about the user from Auth0
  const getAuth0UserInfo = async (accessToken?: string) => {
    let name = 'Unknown'
    let id = 'Unknown'
    try {
      const userInfoResponse = await extensionSDK.fetchProxy(
        `${AUTH0_BASE_URL}/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (userInfoResponse.ok) {
        name = userInfoResponse.body?.name || 'Unknown'
        id = userInfoResponse.body?.sub || 'Unknown'
      }
    } catch (error) {
      const errorMessage = extractMessageFromError(error)
      updateErrorMessage(dataDispatch, errorMessage)
      console.error(error)
    }
    updateName(dataDispatch, name)
    return { id, name }
  }

  // Custom login.
  const customSignin = async () => {
    const { id, name } = await getLookerUserInfo()
    try {
      const jwtToken = await signinDataServer(AuthOption.Custom, id, name)
      updateLocationPushState(AuthOption.Custom, jwtToken)
    } catch (error) {
      updateErrorMessage(dataDispatch, 'Login failed')
      console.error('failed to login', error)
    }
  }

  // Get information about the user from Looker
  const getLookerUserInfo = async () => {
    let name = 'Unknown'
    let id: string | number = 'Unknown'
    try {
      // Get information about user from Looker
      const value = await coreSDK.ok(coreSDK.me())
      name = value.display_name || 'Unknown'
      id = value.id || 'Unknown'
    } catch (error) {
      const errorMessage = extractMessageFromError(error)
      updateErrorMessage(dataDispatch, errorMessage)
      console.error(error)
    }
    updateName(dataDispatch, name)
    return { id, name }
  }

  // Sign the user into the Looker server. It returns a JWT tokem
  // that reflects the session. The example shown here is very simple
  // and should not be used in a production implementation.
  const signinDataServer = async (
    chosenAuthOption: AuthOption,
    id: string | number,
    name: string,
    accessToken?: string,
    expiresIn?: string
  ) => {
    // Log into the data server. Pass in the id. The data server
    // can use the id to verify if the user is authorized to use the data server
    // (it doesn't but it could).
    const jwtToken = await dataServerAuth({
      type: chosenAuthOption,
      access_token: accessToken,
      expires_in: expiresIn,
      name,
      id,
    })
    if (!jwtToken) {
      updateErrorMessage(dataDispatch, 'Login failed')
    }
    return jwtToken
  }

  // Session state is stored in push state so it can survive a page
  // reload. It will be lost if the user navigates away from this view.
  const updateLocationPushState = (
    chosenAuthOption: AuthOption,
    jwtToken?: string,
    accessToken?: string,
    googleAccessToken?: string
  ) => {
    // Save access token data in push state.
    // 1. access_token is the token from the authorization (anonymous does not have one)
    // 2. jwt token is the jwt token generated by the server. It is used instead of a cookie
    // 3. googleAccessToken is a token used for accessing the google sheets demo.
    //    a. For the google login it is the same as the access token.
    //    b. For the auth0 login it is requested from auth0 via the data server. Note
    //       Auth0 recommends against this. This is only done for demonstration purposes
    //       and hoops need to be jumped to do it.
    if (jwtToken) {
      history.replace(location.pathname, {
        ...location.state,
        authOption: chosenAuthOption,
        accessToken,
        jwtToken,
        googleAccessToken,
      })
    } else {
      history.replace(location.pathname, {})
    }
  }

  // Sign in using the authorization option of choice. choices are:
  // 1. anonymous - just logs into the data server. there is no validation. a session is created.
  // 2. google - uses oauth2\
  // 3. Github - uses oauth2
  // 3. Auth0 - uses oauth2
  const signin = (chosenAuthOption: AuthOption) => {
    setDialogOpen(false)
    switch (chosenAuthOption) {
      case AuthOption.Google:
        googleSignin()
        break
      case AuthOption.Github:
        githubSignin()
        break
      case AuthOption.Auth0:
        auth0Signin(false)
        break
      case AuthOption.Auth0Alt:
        auth0Signin(true)
        break
      default:
        customSignin()
    }
  }

  // Close the dialog
  const closeDialog = () => {
    setDialogOpen(false)
  }

  // Create message describing what kind of authorization is in use
  let authMessage = ''
  const { jwtToken, authOption } = location.state || {}
  if (jwtToken) {
    switch (authOption) {
      case AuthOption.Google:
        authMessage = `${name}, you are authorized using Google`
        break
      case AuthOption.Github:
        authMessage = `${name}, you are authorized using Github`
        break
      case AuthOption.Auth0:
        authMessage = `${name}, you are authorized using Auth0`
        break
      default:
        authMessage = `${name}, you are authorized`
    }
  } else {
    authMessage = 'You are not authorized!'
  }

  const oauthCodeChallengeSupported = intersects(
    '>=7.17.0',
    extensionSDK.lookerHostData?.lookerVersion || '7.0.0',
    true
  )

  return (
    <Box
      display="flex"
      flexDirection="row"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text>{authMessage}</Text>
      <Button onClick={changeAuthorization}>
        {jwtToken ? 'Sign out' : 'Sign in'}
      </Button>
      <Dialog isOpen={dialogOpen} onClose={closeDialog} width="50vw">
        <DialogContent>
          <Heading>Choose an authentication method</Heading>
          <SpaceVertical mt="xlarge" mb="large">
            <ButtonOutline
              width="100%"
              onClick={signin.bind(null, AuthOption.Google)}
              disabled={GOOGLE_CLIENT_ID === ''}
            >
              Sign with Google (OAUTH implicit flow)
            </ButtonOutline>
            <ButtonOutline
              width="100%"
              onClick={signin.bind(null, AuthOption.Github)}
              disabled={GITHUB_CLIENT_ID === ''}
            >
              Sign with Github (OAUTH code flow with secret key)
            </ButtonOutline>
            <ButtonOutline
              width="100%"
              onClick={signin.bind(null, AuthOption.Auth0)}
              disabled={AUTH0_CLIENT_ID === ''}
            >
              Sign with Auth0 (OAUTH code flow with secret key)
            </ButtonOutline>
            <ButtonOutline
              width="100%"
              onClick={signin.bind(null, AuthOption.Auth0Alt)}
              disabled={AUTH0_CLIENT_ID === '' || !oauthCodeChallengeSupported}
            >
              Sign with Auth0 (OAUTH PKCE flow with code challenge)
            </ButtonOutline>
            <ButtonOutline
              width="100%"
              onClick={signin.bind(null, AuthOption.Custom)}
            >
              Sign in (with custom secret key)
            </ButtonOutline>
          </SpaceVertical>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
