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

import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Heading, Box, ButtonOutline, TextArea } from '@looker/components'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { SandboxStatus } from '../SandboxStatus'
import { ROUTES } from '../../KitchenSink'
import type { ApiFunctionsProps } from './types'

const ApiFunctions: React.FC<ApiFunctionsProps> = () => {
  const history = useHistory()
  const [messages, setMessages] = useState('')
  const extensionContext =
    useContext<ExtensionContextData40>(ExtensionContext40)
  const { extensionSDK } = extensionContext

  const uaName = `${extensionSDK.lookerHostData?.extensionId.replace(
    /(::|-)/g,
    '_'
  )}_user_value`

  const updateMessages = (message: any) => {
    setMessages((prevMessages) => {
      const maybeLineBreak = prevMessages.length === 0 ? '' : '\n'
      return `${prevMessages}${maybeLineBreak}${message}`
    })
  }

  const verifyHostConnectionClick = async () => {
    try {
      const value = await extensionSDK.verifyHostConnection()
      if (value === true) {
        updateMessages('Host verification success')
      } else {
        updateMessages('Invalid response ' + value)
      }
    } catch (error) {
      updateMessages('Host verification failure')
      updateMessages(error)
      console.error('Host verification failure', error)
    }
  }

  const updateTitleButtonClick = () => {
    const date = new Date()
    extensionSDK.updateTitle(
      `Extension Title Update ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    )
    updateMessages('Title updated')
  }

  const goToBrowseButtonClick = () => {
    extensionSDK.updateLocation('/browse')
  }

  const goToMarketplaceButtonClick = () => {
    extensionSDK.updateLocation('/marketplace')
  }

  const openMarketplaceButtonClick = () => {
    extensionSDK.openBrowserWindow('/marketplace', '_marketplace')
    updateMessages('Window opened')
  }

  const localStorageSet = async () => {
    try {
      await extensionSDK.localStorageSetItem('testbed', new Date().toString())
      updateMessages('Success')
    } catch (error) {
      updateMessages(error)
      console.error(error)
    }
  }

  const localStorageGet = async () => {
    try {
      const value = await extensionSDK.localStorageGetItem('testbed')
      updateMessages(value || 'null')
    } catch (error) {
      updateMessages(error)
      console.error(error)
    }
  }

  const localStorageRemove = async () => {
    try {
      await extensionSDK.localStorageRemoveItem('testbed')
      updateMessages('Success')
    } catch (error) {
      updateMessages(error)
      console.error(error)
    }
  }

  const generateUnhandledErrorClick = () => {
    updateMessages('About to generate error')
    // const badApi: any = {}
    // badApi.noExistentMethod()
    throw new Error('Kitchensink threw an error')
  }

  const testRouting = () => {
    history.push(`${ROUTES.CORESDK_ROUTE}?test=abcd`, { count: 1 })
  }

  const getUserAttributeClick = async () => {
    try {
      const value = await extensionSDK.userAttributeGetItem('user_value')
      updateMessages(`User attribute 'user_value' is ${value}`)
    } catch (error) {
      updateMessages(
        `Create a user attribute named "${uaName}" and reload to use this attribute`
      )
      console.error(error)
    }
    try {
      const value = await extensionSDK.userAttributeGetItem('locale')
      updateMessages(`User attribute 'locale' is ${value}`)
    } catch (error) {
      updateMessages(error)
      console.error(error)
    }
  }

  const setUserAttributeClick = async () => {
    try {
      const value = await extensionSDK.userAttributeSetItem(
        'user_value',
        new Date().toString()
      )
      if (value) {
        updateMessages(`Updated 'user_value' to '${value}'`)
      }
    } catch (error) {
      updateMessages(
        `Create a user attribute named "${uaName}" and reload to use this attribute`
      )
      console.error(error)
    }
    // This will fail because global user attributes cannot by modified by an extension
    try {
      const timestamp = new Date().toString()
      const value = await extensionSDK.userAttributeSetItem('locale', timestamp)
      if (value) {
        updateMessages(`Updated 'locale' to '${timestamp}'`)
      }
    } catch (error) {
      updateMessages(error)
      console.error(error)
    }
  }

  const resetUserAttributeClick = async () => {
    try {
      await extensionSDK.userAttributeResetItem('user_value')
      updateMessages(`Reset 'user_value' to default`)
    } catch (error) {
      updateMessages(
        `Create a user attribute named "${uaName}" and reload to use this attribute`
      )
      console.error(error)
    }
    // This will fail because global user attributes cannot by modified by an extension
    try {
      await extensionSDK.userAttributeResetItem('locale')
      updateMessages(`Reset 'locale' default`)
    } catch (error) {
      updateMessages(error)
      console.error(error)
    }
  }

  const writeToClipboardClick = async () => {
    try {
      await extensionSDK.clipboardWrite(
        'https://trends.google.com/trends/trendingsearches/daily?geo=US'
      )
      updateMessages(
        `Google's "I'm feeling lucky" search has been written to the clipboard. Paste into the browser URL to confirm.`
      )
    } catch (error) {
      updateMessages(error)
      console.error(error)
    }
  }

  const clearMessagesClick = () => {
    setMessages('')
  }

  return (
    <>
      <Heading mt="xlarge">API Functions</Heading>
      <SandboxStatus />
      <Box display="flex" flexDirection="row">
        <Box display="flex" flexDirection="column" width="50%" maxWidth="40vw">
          <ButtonOutline mt="small" onClick={updateTitleButtonClick}>
            Update title
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={goToBrowseButtonClick}>
            Go to browse (update location)
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={goToMarketplaceButtonClick}>
            Go to Marketplace (update location)
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={openMarketplaceButtonClick}>
            Open marketplace new window
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={verifyHostConnectionClick}>
            Verify host connection
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={localStorageSet}>
            Set local storage
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={localStorageGet}>
            Get local storage
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={localStorageRemove}>
            Remove local storage
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={generateUnhandledErrorClick}>
            Generate unhandled error
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={testRouting}>
            Route test
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={getUserAttributeClick}>
            Get User Attribute
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={setUserAttributeClick}>
            Set User Attribute
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={resetUserAttributeClick}>
            Reset User Attribute
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={writeToClipboardClick}>
            Write to clipboard
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={clearMessagesClick}>
            Clear messages
          </ButtonOutline>
        </Box>
        <Box width="50%" p="small" maxWidth="40vw">
          <TextArea height="60vh" readOnly value={messages} />
        </Box>
      </Box>
    </>
  )
}

export default ApiFunctions
