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
import { Button, MessageBar, SpaceVertical, Tooltip } from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { DemoWrapper } from '../components'
import { useAtLookerVersion } from '../hooks'

const title = 'Clipboard write'
const description = `Demonstrates how to write to the system clipboard.

The Looker Extension SDK API allows an extension to write to the system
clipboard.

The \`use_clipboard\` entitlement must be set to write to the clipboard.

The feature requires Looker >=21.8.0.`
const code = `const { extensionSDK } = useContext(ExtensionContext40)
await extensionSDK.clipboardWrite(
  'https://trends.google.com/trends/trendingsearches/daily?geo=US'
)`
const codeSourceName = 'Clipboard.jsx'

export const Clipboard = () => {
  const [intent, setIntent] = useState()
  const [message, setMessage] = useState()
  const { extensionSDK } = useContext(ExtensionContext40)
  const atLookerVersion = useAtLookerVersion('>=21.8.0')

  useEffect(() => {
    if (atLookerVersion === false) {
      updateMessage(
        'Copy to clipboard functionality requires Looker version >=21.8.0',
        'warn'
      )
    }
  }, [atLookerVersion])

  const updateMessage = (message, intent = 'inform') => {
    setIntent(intent)
    setMessage(message)
  }

  const writeToClipboard = async () => {
    try {
      await extensionSDK.clipboardWrite(
        'https://trends.google.com/trends/trendingsearches/daily?geo=US'
      )
      updateMessage(
        `Google's "I'm feeling lucky" search has been written to the clipboard. Paste into the browser URL to confirm.`
      )
    } catch (error) {
      updateMessage(
        'Error writing to clipboard. Please check entitlements.',
        'critical'
      )
      console.error(error)
    }
  }

  return (
    <DemoWrapper
      title={title}
      description={description}
      code={code}
      codeSourceName={codeSourceName}
    >
      <SpaceVertical width="30%">
        <Tooltip content="Click to copy a link to the system clipboard.">
          <Button
            onClick={writeToClipboard}
            width="100%"
            disabled={!atLookerVersion}
          >
            Update clipboard
          </Button>
        </Tooltip>
      </SpaceVertical>
      {message && <MessageBar intent={intent}>{message}</MessageBar>}
    </DemoWrapper>
  )
}
