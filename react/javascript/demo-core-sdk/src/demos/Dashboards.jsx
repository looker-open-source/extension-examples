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
  Button,
  DataTable,
  DataTableItem,
  DataTableCell,
  MessageBar,
  Tooltip,
  Spinner,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { DemoWrapper } from '../components'

const title = 'Dashboards'
const description = 'Demonstrates reading dashboards.'
const code = `const { extensionSDK } = useContext(ExtensionContext40)
const tempData = await coreSDK.ok(coreSDK.all_dashboards())`
const codeSourceName = 'Dashboards.jsx'

export const Dashboards = () => {
  const [intent, setIntent] = useState()
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()
  const { coreSDK, extensionSDK } = useContext(ExtensionContext40)

  const updateMessage = (message, intent = 'inform') => {
    setIntent(intent)
    setMessage(message)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      setData(undefined)
      setMessage(undefined)
      const tempData = await coreSDK.ok(coreSDK.all_dashboards())
      setData(tempData)
      updateMessage('Dashboards loaded')
    } catch (error) {
      console.error(error)
      updateMessage('Failed to load dashboards', 'critical')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      id: 'id',
      size: 'small',
      title: 'ID',
      type: 'string',
    },
    {
      id: 'title',
      size: 'large',
      title: 'Title',
      type: 'string',
    },
    {
      id: 'slug',
      size: 'large',
      title: 'Slug',
      type: 'string',
    },
  ]

  const items = (data || [])
    .filter(({ id }) => !isNaN(parseInt(id)))
    .map((item) => {
      const { id, title, slug } = item
      return (
        <DataTableItem
          key={id}
          id={id}
          onClick={() =>
            extensionSDK.openBrowserWindow(
              `/dashboards/${id}`,
              '__dashboards__'
            )
          }
        >
          <DataTableCell>{id}</DataTableCell>
          <DataTableCell>{title}</DataTableCell>
          <DataTableCell>{slug}</DataTableCell>
        </DataTableItem>
      )
    })

  return (
    <DemoWrapper
      title={title}
      description={description}
      code={code}
      codeSourceName={codeSourceName}
    >
      <Tooltip content="Click to load and display dashboard data.">
        <Button onClick={loadData} disabled={loading}>
          Read dashboard data
        </Button>
      </Tooltip>
      <DataTable columns={columns} caption="Dashboard items">
        {items}
      </DataTable>
      {loading && <Spinner />}
      {message && <MessageBar intent={intent}>{message}</MessageBar>}
    </DemoWrapper>
  )
}
