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

import { useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { MessageBar, Box, Heading, Flex } from '@looker/components'
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom'
import {
  getLoading,
  getError,
  getCurrentLook,
  getLooks,
  getCurrentQuery,
} from '../data'
import { useActions } from '../hooks'
import { QueryContainer } from './QueryContainer'
import { LookList } from './LookList'

export const Extension: React.FC = () => {
  const history = useHistory()
  const match = useRouteMatch<{ lookid: string }>('/:lookid')
  const currentLookId = match?.params.lookid
  const currentLook = useSelector(getCurrentLook(currentLookId))
  const loading = useSelector(getLoading)
  const errorMessage = useSelector(getError)
  const currentQuery = useSelector(getCurrentQuery(currentLookId))
  const looks = useSelector(getLooks)
  const { allLooksRequest, runLookRequest } = useActions()
  const loadingLooks = loading && !looks
  const runningQuery = loading && (!!looks || currentLookId !== undefined)

  useEffect(() => {
    allLooksRequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (currentLookId) {
      runLookRequest(currentLookId)
    } else {
      if (looks && looks.length > 0) {
        selectLook(looks[0].id + '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLookId, looks])

  const selectLook = (lookid: string) => {
    if (currentLookId + '' !== lookid) {
      history.push('/' + lookid)
    }
  }

  return (
    <>
      {errorMessage && (
        <MessageBar intent="critical">{errorMessage}</MessageBar>
      )}
      <Box m="large">
        <Heading fontWeight="semiBold">Look Query Extension</Heading>
        <Flex width="100%">
          <LookList
            loading={loadingLooks}
            looks={looks || []}
            selectLook={selectLook}
            selectedLookId={currentLookId}
          />
          <Switch>
            <Route path="/:id">
              <QueryContainer
                look={currentLook}
                results={currentQuery}
                running={runningQuery}
              />
            </Route>
          </Switch>
        </Flex>
      </Box>
    </>
  )
}
