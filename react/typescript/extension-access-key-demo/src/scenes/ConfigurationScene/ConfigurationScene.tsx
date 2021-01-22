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

import React, { useContext, useState } from 'react'
import {
  Box,
  Button,
  FieldText,
  Form,
  Heading,
  SpaceVertical,
} from '@looker/components'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import { ConfigurationSceneProps } from '.'
import { useHistory, useLocation } from 'react-router-dom'
import { ACCESS_KEY_NAME, DATA_SERVER_URL } from '../../App'
import { ROUTES } from '../../AppRouter'

/**
 * Configuration scene. Demonstrates how to programatically add or replace an
 * access key stored in user attributes
 */
export const ConfigurationScene: React.FC<ConfigurationSceneProps> = ({
  updateCriticalMessage,
  updatePositiveMessage,
  clearMessage,
}) => {
  const history = useHistory()
  const location = useLocation()
  const { extensionSDK, core40SDK } = useContext<ExtensionContextData>(
    ExtensionContext
  )
  // Access key state
  const [accessKey, setAccessKey] = useState('')

  /**
   * Update access key state
   */
  const onAccessKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessKey(e.currentTarget.value)
  }

  /**
   * Navigate to home scene
   */
  const onHomeClick = () => {
    clearMessage()
    history.push(ROUTES.HOME_ROUTE, location.state)
  }

  /**
   * Save the license key as a user attribute
   *
   * This is one way of storing the license key. The other methods of doing
   * so would be to manually store it using as a user attribute on the User Attributes page in the Looker Admin panel,
   * or include it as a field in the `marketplace.json` file, which allows the user to set it
   * during the extension configuration.
   */
  const onAccessKeySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Need to prevent the default processing for the form submission
    e.preventDefault()
    clearMessage()
    try {
      // Get the name of the access key user attribute (remove the special characters
      // from the tag name)
      const accessKeyName = extensionSDK
        .createSecretKeyTag(ACCESS_KEY_NAME)
        .replace(/{|}/g, '')
      // Get all of the user attributes (unfortnately user attributes cannot be
      // updated by name)
      const userAttributes = await core40SDK.ok(
        core40SDK.all_user_attributes({})
      )
      // Does the access key already exist?
      const accessKeyUserAttribute = userAttributes.find(
        (userAttribute) => userAttribute.name === accessKeyName
      )
      // Delete it if it does
      if (accessKeyUserAttribute && accessKeyUserAttribute.id) {
        core40SDK.delete_user_attribute(accessKeyUserAttribute.id)
      }
      // Add the access key.
      await core40SDK.ok(
        core40SDK.create_user_attribute({
          name: accessKeyName,
          label: 'APIKEY Demo Access Key',
          default_value: accessKey,
          type: 'string',
          hidden_value_domain_whitelist: `${DATA_SERVER_URL}/*`,
          user_can_edit: false,
          user_can_view: true,
          value_is_hidden: true,
        })
      )
      updatePositiveMessage('Access key saved')
      setAccessKey('')
    } catch (error) {
      updateCriticalMessage('Unexpected error occured')
      console.error(error)
    }
  }

  return (
    <Box m="large">
      <SpaceVertical>
        <Heading>Configuration</Heading>
        <Form onSubmit={onAccessKeySubmit}>
          <FieldText
            label="Access key"
            name="accessKey"
            value={accessKey}
            onChange={onAccessKeyChange}
            type="password"
          />
          <Button disabled={accessKey === ''}>Save configuration</Button>
        </Form>
        <Button onClick={onHomeClick}>Home</Button>
      </SpaceVertical>
    </Box>
  )
}
