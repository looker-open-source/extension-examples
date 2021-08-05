/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React, { useContext, useEffect, useState } from 'react'
import {
  Form,
  Button,
  ButtonOutline,
  FieldText,
  Space,
} from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { SyntheticEvent } from 'react'
import { SevenGuisState } from '../'

export const Counter: React.FC = () => {
  const { extensionSDK } = useContext(ExtensionContext)
  const [count, setCount] = useState(0)

  const onCount = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newCount = count + 1
    setCount(newCount)
  }

  const onReset = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCount(0)
  }

  useEffect(() => {
    const contextData: SevenGuisState = extensionSDK.getContextData() || {}
    if (contextData.counter) {
      contextData.counter.count = count
    } else {
      contextData.counter = { count }
    }
    extensionSDK.saveContextData(contextData)
  }, [count, extensionSDK])

  useEffect(() => {
    const contextData = extensionSDK.getContextData()
    if (contextData) {
      const { counter } = contextData as SevenGuisState
      if (counter) {
        setCount(counter.count)
      }
    }
  }, [extensionSDK])

  return (
    <Space height="30vh" around>
      <Space width="50%">
        <Form onSubmit={onCount}>
          <FieldText
            label="Counter"
            name="title"
            value={count}
            readOnly={true}
          />
          <Space>
            <Button type="submit">Count</Button>
            <ButtonOutline onClick={onReset}>Reset</ButtonOutline>
          </Space>
        </Form>
      </Space>
    </Space>
  )
}
