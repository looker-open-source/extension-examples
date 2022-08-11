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

import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import React, { useContext, useEffect, useState } from 'react'
import { Switch, Route, useHistory, useLocation } from 'react-router-dom'
import { ConfigurationScene } from './scenes/ConfigurationScene'
import { HomeScene } from './scenes/HomeScene'
import type { MessageHandlerProps } from './App'
import { ACCESS_KEY_NAME, DATA_SERVER_URL } from './App'

/**
 * Access key demo. Checks to see if the configuration scene should
 * be displayed by checking the show_configuration_editor user attribute
 * created during the Marketplace installation. In the extension is not
 * loaded through Marketplace, the configuration scene is accessable.
 *
 * Note that access to the congiguration scene requires enhanced permissions.
 */

interface AccessKeyDemoProps extends MessageHandlerProps {}

/**
 * Routes for the extension.
 */
export enum ROUTES {
  HOME_ROUTE = '/',
  CONFIGURATION_ROUTE = '/config',
}

/**
 * Extension router
 */
export const AccessKeyDemo: React.FC<AccessKeyDemoProps> = ({
  updateCriticalMessage,
  updatePositiveMessage,
  clearMessage,
}) => {
  const [canConfigure, setCanConfigure] = useState<boolean>(false)
  const { extensionSDK, coreSDK } =
    useContext<ExtensionContextData40>(ExtensionContext40)
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    createJwtToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createJwtToken = async () => {
    let showConfigurationEditor
    try {
      // Display of configuration editor can be configured using extension
      // user attributes. This example assumes that the configuration
      // of the configuration editor only occurs through the marketplace
      // installation.
      const userAttribute = await extensionSDK.userAttributeGetItem(
        'show_configuration_editor'
      )
      // User attributes of yesno do NOT return boolean values. They
      // actually return strings constrained to yes or no (or a null).
      showConfigurationEditor = userAttribute !== 'no'
    } catch (error) {
      // Currently an error is thrown if the user attributes are not defined
      // which means the extension SDK userAttribute methods wont work if the
      // extension was not added through the marketplace.
      // This MAY change in a future release of the SDK.
      showConfigurationEditor = true
    }

    let locationState = {}
    try {
      // Get information about the current user.
      const value = await coreSDK.ok(coreSDK.me())
      // Configuration requires configuration editor to be enabled and the
      // user to have enhanced permissions
      if (
        showConfigurationEditor &&
        value.can?.index_details &&
        value.can?.show_details
      ) {
        setCanConfigure(true)
      }

      const name = value.display_name || 'Unknown'
      const email = value.email || 'Unknown'

      // Prepare to validate the access key. Create secret key tag
      // creates a specially formatted string that the Looker server
      // looks for and replaces with secret keys stored in the Looker
      // server.
      const access_key = extensionSDK.createSecretKeyTag(ACCESS_KEY_NAME)
      // Call the data server to validate the access key.
      // Note the access key remains in the Looker server. Care should be
      // taken when developing the access token validation endpoint that
      // it does not return the access token in its response.
      const response = await extensionSDK.serverProxy(
        `${DATA_SERVER_URL}/access_check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ access_key, name, email }),
        }
      )
      if (response.ok) {
        if (response.body) {
          const { jwt_token } = response.body
          if (jwt_token) {
            // Got a jwt token in the response so the access check was good.
            // Store the jwt token in push state. This allows the jwt token
            // to be preserved on a page reload. Not needed for this demo
            // however the token does need to be stored somewhere.
            locationState = { jwt_token }
            updatePositiveMessage('Access key is valid')
          } else {
            // No jwt token so not valid
            updateCriticalMessage('Access key is NOT valid')
          }
        }
      } else {
        // Invalid response so not valid
        updateCriticalMessage('Access key is NOT valid')
      }
    } catch (error) {
      updateCriticalMessage('Unexpected error occurred')
      console.error(error)
    }
    history.replace(location.pathname, locationState)
  }

  return (
    <Switch>
      {canConfigure && (
        <Route path={ROUTES.CONFIGURATION_ROUTE}>
          <ConfigurationScene
            updateCriticalMessage={updateCriticalMessage}
            updatePositiveMessage={updatePositiveMessage}
            clearMessage={clearMessage}
            createJwtToken={createJwtToken}
          />
        </Route>
      )}
      <Route>
        <HomeScene
          updateCriticalMessage={updateCriticalMessage}
          updatePositiveMessage={updatePositiveMessage}
          clearMessage={clearMessage}
          canConfigure={canConfigure}
        />
      </Route>
    </Switch>
  )
}
