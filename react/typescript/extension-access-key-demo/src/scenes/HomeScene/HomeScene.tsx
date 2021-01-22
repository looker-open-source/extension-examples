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

import React, { useContext, useState, useEffect } from 'react'
import { Box, Button, Heading, SpaceVertical } from '@looker/components'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import { DATA_SERVER_URL } from '../../App'
import { ROUTES } from '../../AppRouter'
import { createDataServerFetchProxy } from '../../utils'
import { HomeSceneProps } from '.'
import { useHistory, useLocation } from 'react-router-dom'

/**
 * Default scene for the APIKEY demo.
 *
 * Verifies that a valid access key has been defined to user attributes in the Looker server.
 * If the access key is not valid the user can add the access key to user attributes using
 * the core SDK. This is demoed in the AccessKeyScene.
 */

/**
 * JWT state is stored in push state
 */
interface LocationState {
  jwt_token?: string
}

export const HomeScene: React.FC<HomeSceneProps> = ({
  canConfigure,
  updateCriticalMessage,
  updatePositiveMessage,
  clearMessage,
}) => {
  const history = useHistory()
  const location = useLocation()
  const { extensionSDK } = useContext<ExtensionContextData>(ExtensionContext)

  /**
   * On add/update access key button navigate click navigate to access key scene
   */
  const onAddUpdateAccessKeyClick = () => {
    clearMessage()
    history.push(ROUTES.CONFIGURATION_ROUTE, location.state)
  }

  /**
   * Verify the jwt token
   */
  const onVerifyTokenClick = async () => {
    try {
      clearMessage()
      const fetchProxy = createDataServerFetchProxy(
        extensionSDK,
        location.state
      )
      // Call the data server ping endpoint to validate the token
      let response = await fetchProxy.fetchProxy(`${DATA_SERVER_URL}/ping`)
      if (response.ok) {
        updatePositiveMessage('JWT Token is valid')
      } else {
        updateCriticalMessage('JWT Token is NOT valid')
      }
    } catch (error) {
      updateCriticalMessage('Unexpected error occured')
    }
  }

  const { state } = location
  const { jwt_token } = (state || {}) as LocationState

  return (
    <Box m="large">
      <SpaceVertical>
        <Heading>Home</Heading>
        <Button onClick={onVerifyTokenClick} disabled={!jwt_token}>
          Verify JWT token
        </Button>
        {canConfigure && (
          <Button onClick={onAddUpdateAccessKeyClick}>Configure</Button>
        )}
      </SpaceVertical>
    </Box>
  )
}
