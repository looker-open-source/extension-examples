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

const title = 'Local Storage'
const description = `Demonstrates how to interact with local storage.

Sandboxed iframes do not allow access to browser local storage.
The Looker Extension SDK allows an extension to read and write to the parent
window’s local storage. Local storage is namespaced to the extension, meaning
it cannot read local storage created by the parent window or other extensions.

The \`local_storage\` entitlement must be set to interact with local storage.`
const code = `const { extensionSDK } = useContext(ExtensionContext40)
const localStorageItemId = 'ITEM_DATA'
const data = await extensionSDK.localStorageGetItem(
  localStorageItemId
)
await extensionSDK.localStorageSetItem(localStorageItemId, data)
await extensionSDK.localStorageRemoveItem(localStorageItemId)`
const codeSourceName = 'LocalStorage.jsx'

const itemId = 'ITEM_DATA'

export const LocalStorage = () => {
  const [message, setMessage] = useState()
  const [data, setData] = useState('')
  const { extensionSDK } = useContext(ExtensionContext40)

  useEffect(() => {
    const loadLocalStorage = async () => {
      const tempData = await extensionSDK.localStorageGetItem(itemId)
      setData(tempData || '')
      setMessage('Data loaded from local storage')
    }
    loadLocalStorage()
  }, [extensionSDK])

  const dataChanged = (event) => {
    setData(event.target.value)
    setMessage(undefined)
  }

  const saveLocalStorageData = async () => {
    setMessage(undefined)
    await extensionSDK.localStorageSetItem(itemId, data)
    setMessage('Data saved to local storage')
  }

  const restoreLocalStorageData = async () => {
    setMessage(undefined)
    const data = await extensionSDK.localStorageGetItem(itemId)
    setData(data || '')
    setMessage('Data restored from local storage')
  }

  const removeLocalStorageData = async () => {
    setMessage(undefined)
    await extensionSDK.localStorageRemoveItem(itemId)
    setData('')
    setMessage('Data removed from local storage')
  }

  return (
    <DemoWrapper
      title={title}
      description={description}
      code={code}
      codeSourceName={codeSourceName}
    >
      <TextArea onChange={dataChanged} value={data} />
      <Space>
        <Tooltip content="Click to save the data to local storage.">
          <Button onClick={saveLocalStorageData}>
            Save data to local storage
          </Button>
        </Tooltip>
        <Tooltip content="Click to restore the last saved local storage data.">
          <Button onClick={restoreLocalStorageData}>
            Restore data from local storage
          </Button>
        </Tooltip>
        <Tooltip content="Click to remove data from local storage.">
          <Button onClick={removeLocalStorageData}>
            Remove data from local storage
          </Button>
        </Tooltip>
      </Space>
      {message && <MessageBar intent="inform">{message}</MessageBar>}
    </DemoWrapper>
  )
}
