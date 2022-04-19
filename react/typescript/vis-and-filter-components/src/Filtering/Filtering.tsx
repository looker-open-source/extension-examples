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

import type { FC, FormEvent } from 'react'
import React, { useState, useEffect, useCallback } from 'react'
import {
  useQueryId,
  useQueryMetadata,
  useCreateQuery,
} from '@looker/components-data'
import { Button, Fieldset } from '@looker/components'
import type { IQuery, IWriteQuery } from '@looker/sdk'
import { ActiveFilters } from '../ActiveFilters'

type FilteringProps = {
  setQueryIdentifier: (id: string | number) => void
  query?: string | number
}

const createQueryRequest = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { client_id, ...query }: IQuery,
  newFilters: IQuery['filters']
) => {
  const result: Partial<IWriteQuery> = {
    ...query,
    filters: newFilters,
  }
  return result
}

export const Filtering: FC<FilteringProps> = ({
  query,

  setQueryIdentifier,
}) => {
  const [draftQueryMetadata, setDraftQueryMetadata] = useState<
    Partial<IWriteQuery> | undefined
  >()

  const { queryId } = useQueryId(query)
  const {
    metadata,
    metadata: { filters: currentFilters = {} },
  } = useQueryMetadata(queryId)

  const [draftFilters, setDraftFilters] =
    useState<IQuery['filters']>(currentFilters)
  const [isFieldsetOpen, setIsFieldsetOpen] = useState(false)

  // caution: side effects!
  // create a new query when the draftQueryMetadata is updated
  const { queryId: draftQueryId } = useCreateQuery(draftQueryMetadata)

  const handleFilterSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newQuery = createQueryRequest(metadata, draftFilters)
    setDraftQueryMetadata(newQuery)
  }

  const handleRemoveFilter = (name: string) => {
    const filterStateCopy = { ...draftFilters }
    delete filterStateCopy[name]
    setDraftFilters(filterStateCopy)
  }

  const handleUpdateFilter = useCallback(
    (name: string, expression: string) => {
      setDraftFilters({ ...draftFilters, [name]: expression })
    },
    [JSON.stringify(draftFilters)]
  )

  useEffect(() => {
    if (draftQueryId && draftQueryId !== queryId) {
      // render new query that was created by `useCreateNewQuery`
      setQueryIdentifier(draftQueryId)
      // reset local state post submit
      setDraftQueryMetadata(undefined)
    }
  }, [draftQueryId, queryId, setQueryIdentifier, setDraftQueryMetadata])

  useEffect(() => {
    setDraftFilters(metadata.filters)
    setIsFieldsetOpen(Object.keys(currentFilters || {}).length > 0)
  }, [metadata.filters, currentFilters, setIsFieldsetOpen])

  console.log(metadata.filters, draftFilters)

  if (!queryId) {
    return null
  }

  return (
    <form onSubmit={handleFilterSubmit}>
      <Fieldset
        legend="Filters"
        accordion
        isOpen={isFieldsetOpen}
        toggleOpen={setIsFieldsetOpen}
      >
        <ActiveFilters
          onRemoveFilter={handleRemoveFilter}
          onUpdateFilter={handleUpdateFilter}
          queryId={queryId}
          filters={draftFilters}
        />
        <Button onClick={handleFilterSubmit}>Run</Button>
      </Fieldset>
    </form>
  )
}
