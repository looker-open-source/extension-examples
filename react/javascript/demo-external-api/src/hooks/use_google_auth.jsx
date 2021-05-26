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
import { useContext, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ExtensionContext2 } from '@looker/extension-sdk-react'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/spreadsheets'

/**
 * Hook that handles google OAUTH2 authentication. The OAUTH2 token
 * is stored in the browser push state which allows it to survive a
 * page reload.
 *
 * The OAUTH2 token expire. When it does, the token is cleared from
 * push state resulting in the majority of components being hidden.
 * There are more user friendly ways of handling this but this is
 * a demo app so a simple approach has been taken.
 */
export const useGoogleAuth = () => {
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
      const response = await extensionSDK.oauth2Authenticate(
        'https://accounts.google.com/o/oauth2/v2/auth',
        {
          client_id: GOOGLE_CLIENT_ID,
          scope: GOOGLE_SCOPES,
          response_type: 'token',
        }
      )
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

  return { loggingIn, token: state, signIn, signOut }
}
