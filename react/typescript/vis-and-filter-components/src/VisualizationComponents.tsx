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
import type { FormEvent } from 'react'
import React, { useContext, useState } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { Query, Visualization } from '@looker/visualizations'
import { DataProvider } from '@looker/components-data'
import { FieldText, Text } from '@looker/components'
import { Filtering } from './Filtering'

/**
 * A simple component that uses the Looker SDK through the extension sdk to display a customized hello message.
 */
export const VisualizationComponents: React.FC = () => {
  const { core40SDK } = useContext(ExtensionContext)
  const [queryIdentifier, setQueryIdentifier] = useState<
    string | number | undefined
  >('')

  const handleQueryIdChange = (e: FormEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement
    setQueryIdentifier(value)
  }

  return (
    <DataProvider sdk={core40SDK}>
      <FieldText
        label="Query (Numeric ID or Slug)"
        name="query"
        value={queryIdentifier}
        onChange={handleQueryIdChange}
        my="xsmall"
        placeholder="abcxyz..."
      />

      <Filtering
        setQueryIdentifier={setQueryIdentifier}
        query={queryIdentifier}
      />
      {queryIdentifier ? (
        <Query query={queryIdentifier}>
          <Visualization />
        </Query>
      ) : (
        <Text>Enter a query id or slug in the field above to get started.</Text>
      )}
    </DataProvider>
  )
}
