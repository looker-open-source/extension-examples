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
  Text,
  Space,
  SpaceVertical,
  Box,
  Button,
  ButtonOutline,
  MessageBar,
} from '@looker/components'
import { useFileUpload } from 'use-file-upload'

export const FileUpload = () => {
  const [messageData, setMessageData] = useState({
    intent: 'inform',
    message: 'Select file to upload',
  })

  const [file, selectFile] = useFileUpload()
  const { intent, message } = messageData

  const uploadFile = async (url) => {
    try {
      // Cannot use extension SDK fetch proxy as file FormData
      // containing file data cannot be serialized over chatty.
      const formData = new FormData()
      formData.append('upload_file', file.file)
      // Normally an auth token would be added to this request.
      await fetch(url, {
        body: formData,
        method: 'POST',
      })
      setMessageData({ intent: 'positive', message: 'File uploaded' })
    } catch (err) {
      console.error(err)
      const errMessage = err.message.startsWith(
        'not entitled to access external url '
      )
        ? 'Not entitled to access upload server'
        : 'Failed to upload file'
      setMessageData({ intent: 'critical', message: errMessage })
    }
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
            <Button
              onClick={uploadFile.bind(
                null,
                'http://localhost:3000/fileupload'
              )}
              disabled={!file}
            >
              Entitled upload file
            </Button>
          </Box>
          <Box>
            <Button
              onClick={uploadFile.bind(
                null,
                'http://127.0.0.1:3000/fileupload'
              )}
              disabled={!file}
            >
              Unentitled upload file
            </Button>
          </Box>
          <Box>
            <ButtonOutline onClick={selectFile}>
              Select file to upload
            </ButtonOutline>
          </Box>
          {file && (
            <>
              <img
                src={file.source}
                alt="preview"
                width="200px"
                height="200px"
              />
              <Text>Name: {file.name}</Text>
              <Text>Size: {file.size}</Text>
            </>
          )}
        </SpaceVertical>
      </Space>
    </ComponentsProvider>
  )
}
