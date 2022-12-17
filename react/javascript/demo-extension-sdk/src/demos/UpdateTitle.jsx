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
import { Button, SpaceVertical, Tooltip } from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { DemoWrapper } from '../components'

const title = 'Update Window Title'
const description = 'Demonstrates how to update the current window title.'
const code = `const { extensionSDK } = useContext(ExtensionContext40)
extensionSDK.updateTitle("My Extension Title")`
const codeSourceName = 'UpdateTitle.jsx'

export const UpdateTitle = () => {
  const { extensionSDK } = useContext(ExtensionContext40)
  const onClick = () => {
    extensionSDK.updateTitle('My Extension Title')
  }

  return (
    <DemoWrapper
      title={title}
      description={description}
      code={code}
      codeSourceName={codeSourceName}
    >
      <SpaceVertical width="30%">
        <Tooltip content="Click to change the current window title. After clicking, title should read 'My Extension Title'">
          <Button onClick={onClick} width="100%">
            Update window title
          </Button>
        </Tooltip>
      </SpaceVertical>
    </DemoWrapper>
  )
}
