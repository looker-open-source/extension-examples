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
import {
  Heading,
  Box,
  Paragraph,
  ButtonOutline,
  SpaceVertical,
  TextArea,
} from '@looker/components'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import type { ExtensionHostApi } from '@looker/extension-sdk'
import { SandboxStatus } from '../SandboxStatus'
import type { MiscFunctionsProps } from './types'

const MiscFunctions: React.FC<MiscFunctionsProps> = () => {
  const [messages, setMessages] = useState('')
  const extensionContext =
    useContext<ExtensionContextData40>(ExtensionContext40)
  const extensionSDK = extensionContext.extensionSDK as ExtensionHostApi

  const updateMessages = (message: string) => {
    setMessages((prevMessages) => {
      const maybeLineBreak = prevMessages.length === 0 ? '' : '\n'
      return `${prevMessages}${maybeLineBreak}${message}`
    })
  }

  const createAndSubmitForm = () => {
    // DO NOT DO THIS!
    // The following demonstrates the extension being reloaded
    // should an attempt to navigate away occur. This includes
    // form submissions.
    const form = document.createElement('form')
    document.body.appendChild(form)
    form.submit()
  }

  const navigateAwayClick = () => {
    updateMessages('Change extension window location')
    createAndSubmitForm()
  }

  const openWindowClick = () => {
    try {
      window.open('https://example.com', '_blank')
      updateMessages('Attempt to open window succeded. This should not happen!')
    } catch (err) {
      updateMessages('Attempt to open window failed. As expected!')
    }
  }

  const clearMessagesClick = () => {
    setMessages('')
  }

  const logout = () => {
    extensionSDK.spartanLogout()
  }

  const hostType = extensionSDK.lookerHostData?.hostType
  const spartanMode = !hostType || hostType === 'spartan'

  return (
    <>
      <Heading mt="xlarge">Miscellaneous Functions</Heading>
      <SandboxStatus />
      <Box display="flex" flexDirection="row">
        <SpaceVertical width="50%" maxWidth="40vw">
          <Paragraph>
            Clicking the button below will cause the extension to try and
            navigate to a new location within the extension window (not the
            owning window for which there is an extension SDK method). This is
            not allowed (extensions MUST be single page applications). The
            extension will be reloaded if the window location does change.
          </Paragraph>
          <Paragraph>
            A circuit breaker has been built into the extension reload
            functionality. Should an extension attempt to change location more
            than 3 times in a 30 second window, the extension will NOT be
            reloaded and an error message will be displayed. You can simulate
            this by pressing the button 4 times within the 30 second window (you
            have to wait for the extension to reload).
          </Paragraph>
          <ButtonOutline mt="small" onClick={navigateAwayClick}>
            Change extension window location
          </ButtonOutline>
          <Paragraph>
            The extension framework prevents you from opening windows directly.
            Clicking the button below attempts to this and should fail.
          </Paragraph>
          <ButtonOutline mt="small" onClick={openWindowClick}>
            Attempt to open window directly (should fail)
          </ButtonOutline>
          <ButtonOutline mt="small" onClick={clearMessagesClick}>
            Clear messages
          </ButtonOutline>
          {spartanMode && (
            <ButtonOutline mt="small" onClick={logout}>
              Logout of Looker (only in spartan mode)
            </ButtonOutline>
          )}
        </SpaceVertical>
        <Box width="50%" p="small" maxWidth="40vw">
          <TextArea height="60vh" readOnly value={messages} />
        </Box>
      </Box>
    </>
  )
}

export default MiscFunctions
