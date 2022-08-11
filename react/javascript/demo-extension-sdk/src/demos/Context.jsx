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
  Space,
  TextArea,
  Tooltip,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { DemoWrapper } from '../components'

const title = 'Extension Context'
const description = `Demonstrates how to interact with the extension context.

Extensions have the ability to share context data between all users of an extension.
The context data can be used for data that does not change frequently and that does
not have special security requirements. Care should be taken when writing the data,
as there is no data locking and the last write wins. The context data is available
to the extension immediately upon startup.`
const code = `const { extensionSDK } = useContext(ExtensionContext40)
const data = extensionSDK.getContextData())
await extensionSDK.saveContextData(data)
data = await extensionSDK.refreshContextData()
`
const codeSourceName = 'Context.jsx'

export const Context = () => {
  const [message, setMessage] = useState()
  const [data, setData] = useState('')
  const { extensionSDK } = useContext(ExtensionContext40)

  useEffect(() => {
    setData(extensionSDK.getContextData())
  }, [extensionSDK])

  const contextDataChanged = (event) => {
    setData(event.target.value)
    setMessage(undefined)
  }

  const saveContextData = async () => {
    setMessage(undefined)
    await extensionSDK.saveContextData(data)
    setMessage('Context data saved')
  }

  const restoreContextData = async () => {
    setMessage(undefined)
    const data = await extensionSDK.refreshContextData()
    setData(data)
    setMessage('Context data restored')
  }

  return (
    <DemoWrapper
      title={title}
      description={description}
      code={code}
      codeSourceName={codeSourceName}
    >
      <TextArea onChange={contextDataChanged} value={data} />
      <Space>
        <Tooltip content="Click to save the context data.">
          <Button onClick={saveContextData}>Save context data</Button>
        </Tooltip>
        <Tooltip content="Click to restore the last saved context data.">
          <Button onClick={restoreContextData}>Restore context data</Button>
        </Tooltip>
      </Space>
      {message && <MessageBar intent="inform">{message}</MessageBar>}
    </DemoWrapper>
  )
}
