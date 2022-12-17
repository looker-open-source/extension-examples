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

import React, { useContext } from 'react'
import { Button, Tooltip, SpaceVertical } from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { DemoWrapper } from '../components'

const title = 'Navigation functions'
const description = `Demonstration of the extension navigation functions. As the extension is running in
a sandboxed iframe, it is not allowed to directly use the parents \`window.location\` to navigate
to a different page or to open a new browser window. The extensionSDK provides APIs to allow you to this
but permission to do so must be requested through entitlements.

- The \`navigation\` entitlement must be set to change the location of the current window.
- The \`new_window\` entitlement must be set to open a new window in the current Looker instance.
- The \`new_window_external_urls\` entitlement must be set to open a new window at a server other
than the current Looker server

`
const code = `  const { extensionSDK } = useContext(ExtensionContext40)

  extensionSDK.updateLocation('/')

  extensionSDK.openBrowserWindow('/')

  extensionSDK.openBrowserWindow(
    'https://docs.looker.com/data-modeling/extension-framework',
    '_docs_'
  )
`
const codeSourceName = 'Navigation.jsx'

export const Navigation = () => {
  const { extensionSDK } = useContext(ExtensionContext40)

  const navigateHome = () => {
    extensionSDK.updateLocation('/')
  }

  const openHome = () => {
    extensionSDK.openBrowserWindow('/')
  }

  const openLookerDocs = () => {
    extensionSDK.openBrowserWindow(
      'https://docs.looker.com/data-modeling/extension-framework',
      '_docs_'
    )
  }

  return (
    <DemoWrapper
      title={title}
      description={description}
      code={code}
      codeSourceName={codeSourceName}
    >
      <SpaceVertical width="30%">
        <Tooltip content="Click to unload extension and show the home page.">
          <Button onClick={navigateHome} width="100%">
            Navigate home
          </Button>
        </Tooltip>
        <Tooltip content="Click to show the home page in new window.">
          <Button onClick={openHome} width="100%">
            Open home in a new window
          </Button>
        </Tooltip>
        <Tooltip content="Click to open Looker extension documentation in a new window.">
          <Button onClick={openLookerDocs} width="100%">
            Open Looker documentation in a new window
          </Button>
        </Tooltip>
      </SpaceVertical>
    </DemoWrapper>
  )
}
