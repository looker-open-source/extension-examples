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

import React, { useState } from 'react'
import {
  ComponentsProvider,
  Space,
  SpaceVertical,
  Box,
  Button,
  MessageBar,
} from '@looker/components'

export const FileDownload = () => {
  const [messageData, setMessageData] = useState({
    intent: 'inform',
    message: 'Click button to download file',
  })

  const { intent, message } = messageData

  const downloadFile = async () => {
    // The following is based upon a customer provided example
    const jsonText = { test: 'test' }
    const fileName = 'filename.json'
    const data = new Blob([JSON.stringify(jsonText)], { type: 'text/json' })
    const jsonURL = window.URL.createObjectURL(data)
    const link = document.createElement('a')
    document.body.appendChild(link)
    link.href = jsonURL
    link.setAttribute('download', fileName)
    link.click()
    document.body.removeChild(link)
    // Unfortunately a way to detect if the download has succeeded
    // or failed has not been found. If the download fails because
    // the allow-download sandbox attribute has not been it will be
    // silent. A message will however, be reported in the javascript
    // console.
    setMessageData({ intent: 'positive', message: 'File downloaded' })
  }

  return (
    <ComponentsProvider
      themeCustomizations={{
        colors: { key: '#1A73E8' },
      }}
    >
      <MessageBar intent={intent}>{message}</MessageBar>
      <Space p="xxxxxlarge" width="100%" height="50vh" around>
        <SpaceVertical width="100%" align="center">
          <Box>
            <Button onClick={downloadFile}>Download file</Button>
          </Box>
        </SpaceVertical>
      </Space>
    </ComponentsProvider>
  )
}
