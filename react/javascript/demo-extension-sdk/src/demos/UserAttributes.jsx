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

import React, { useEffect, useContext, useState } from 'react'
import {
  Button,
  MessageBar,
  Paragraph,
  Space,
  TextArea,
  Tooltip,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { DemoWrapper } from '../components'

const title = 'User Attributes'
const description = `Demonstrates how to access user attributes.

There are two types of user attribute access:
- Scoped — Associated with the extension. A scoped user attribute is namespaced to the extension and
the user attribute must be defined in the Looker instance before it can be used. To namespace a user
attribute, prefix the attribute name with the extension name. Any dash and the ‘::’ characters in the
extension name must be replaced by an underscore, since dashes and colons cannot be used in user
attribute names.
- Global — These are global user attributes and are read only. An example is the locale user attribute.`
const code = `const { extensionSDK } = useContext(ExtensionContext40)
const itemId = 'user_value'
const data = await extensionSDK.userAttributeGetItem(itemId)
await extensionSDK.userAttributeSetItem(itemId, data)
await extensionSDK.userAttributeResetItem(itemId)`
const codeSourceName = 'UserAttributes.jsx'

const globalItemId = 'locale'
const itemId = 'user_value'

export const UserAttributes = () => {
  const [intent, setIntent] = useState()
  const [message, setMessage] = useState()
  const [globalData, setGlobalData] = useState('')
  const [data, setData] = useState('')
  const { extensionSDK } = useContext(ExtensionContext40)

  const updateMessage = (message, intent = 'inform') => {
    setIntent(intent)
    setMessage(message)
  }

  useEffect(() => {
    const loadUserAttributeValues = async () => {
      try {
        // Global user attribute values cannot be updated.
        setGlobalData('Loading...')
        const tempGlobalData = await extensionSDK.userAttributeGetItem(
          globalItemId
        )
        setGlobalData(tempGlobalData || '')
      } catch (_) {
        setGlobalData(
          'Failed to load Locale user attribute. Check entitlements.'
        )
      }
      try {
        const tempData = await extensionSDK.userAttributeGetItem(itemId)
        setData(tempData || '')
        setMessage('User attribute value loaded')
      } catch (_) {
        updateMessage(
          'Failed to load user attribute. Check user attribute defined and entitlements.',
          'critical'
        )
      }
    }
    loadUserAttributeValues()
  }, [extensionSDK])

  const dataChanged = (event) => {
    setData(event.target.value)
    updateMessage(undefined)
  }

  const saveUserAttributeValue = async () => {
    setMessage(undefined)
    await extensionSDK.userAttributeSetItem(itemId, data)
    updateMessage('User attribute value saved')
  }

  const restoreUserAttributeValue = async () => {
    setMessage(undefined)
    const data = await extensionSDK.userAttributeGetItem(itemId)
    setData(data)
    updateMessage('User attribute data restored')
  }

  const resetUserAttributeValue = async () => {
    setMessage(undefined)
    await extensionSDK.userAttributeResetItem(itemId)
    setData('')
    updateMessage('User attribute data reset to default value')
  }

  return (
    <DemoWrapper
      title={title}
      description={description}
      code={code}
      codeSourceName={codeSourceName}
    >
      <Paragraph>
        Locale value from user attributes is &quot;{globalData}&quot;.
      </Paragraph>
      <TextArea onChange={dataChanged} value={data} />
      <Space>
        <Tooltip content="Click to save user attribute value.">
          <Button onClick={saveUserAttributeValue}>
            Save user attribute value
          </Button>
        </Tooltip>
        <Tooltip content="Click to restore user attribute value.">
          <Button onClick={restoreUserAttributeValue}>
            Restore user attribute value
          </Button>
        </Tooltip>
        <Tooltip content="Click to reset user attribute value to default value.">
          <Button onClick={resetUserAttributeValue}>
            Reset user attribute value
          </Button>
        </Tooltip>
      </Space>
      {message && <MessageBar intent={intent}>{message}</MessageBar>}
    </DemoWrapper>
  )
}
