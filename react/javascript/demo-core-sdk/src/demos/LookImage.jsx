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
import { Button, MessageBar, Spinner, Tooltip } from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { DemoWrapper } from '../components'

const title = 'Look Image'
const description = 'Demonstrates rendering a Look image.'
const code = `const { extensionSDK } = useContext(ExtensionContext40)
const looks = await coreSDK.ok(coreSDK.all_looks('id'))
const rand = Math.floor(Math.random() * looks.length)
const value = await coreSDK.ok(
  coreSDK.run_look({
    look_id: looks[rand].id,
    result_format: 'png',
  })
)`
const codeSourceName = 'LookImage.jsx'

export const LookImage = () => {
  const [intent, setIntent] = useState()
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()
  const { coreSDK } = useContext(ExtensionContext40)

  const updateMessage = (message, intent = 'inform') => {
    setIntent(intent)
    setMessage(message)
  }

  const loadData = async () => {
    try {
      setMessage(undefined)
      setData(undefined)
      const looks = await coreSDK.ok(coreSDK.all_looks('id'))
      if (looks.length > 0) {
        setLoading(true)
        const rand = Math.floor(Math.random() * looks.length)
        const value = await coreSDK.ok(
          coreSDK.run_look({
            look_id: looks[rand].id,
            result_format: 'png',
          })
        )
        if (value instanceof Blob) {
          setData(URL.createObjectURL(value))
        } else {
          setData(btoa(`data:image/png;base64,${value}`))
        }
        updateMessage('Got image')
      } else {
        updateMessage('No looks to render', 'critical')
      }
    } catch (error) {
      console.error(error)
      updateMessage('Failed to load look data', 'critical')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DemoWrapper
      title={title}
      description={description}
      code={code}
      codeSourceName={codeSourceName}
    >
      <Tooltip content="Click to generate Look image">
        <Button onClick={loadData} disabled={loading}>
          Generate Look image
        </Button>
      </Tooltip>
      {loading && <Spinner />}
      {data && <img src={data} />}
      {message && <MessageBar intent={intent}>{message}</MessageBar>}
    </DemoWrapper>
  )
}
