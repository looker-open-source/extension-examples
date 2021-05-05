/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
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

import React, { useState, useEffect, useContext } from 'react'
import { hot } from 'react-hot-loader/root'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import { LookList } from './LookList'
import { QueryContainer } from './QueryContainer'
import { MessageBar, Box, Heading, Flex } from '@looker/components'
import { ILook } from '@looker/sdk'
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom'

export const Extension: React.FC<{}> = hot(() => {
  const [loadingLooks, setLoadingLooks] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [looks, setLooks] = useState<ILook[]>([])
  const [currentLook, setCurrentLook] = useState<ILook>()
  const [runningQuery, setRunningQuery] = useState<boolean>(false)
  const [queryResult, setQueryResult] = useState<string>('')

  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { core40SDK } = extensionContext
  const history = useHistory()
  const match = useRouteMatch<{ lookid: string }>('/:lookid')

  useEffect(() => {
    loadLooks()
  }, [])

  useEffect(() => {
    const lookid = match?.params.lookid
    let selectedLook
    if (lookid && looks.length > 0) {
      selectedLook = looks.find((look) => look.id + '' === lookid)
      if (selectedLook && (!currentLook || currentLook.id !== selectedLook)) {
        setCurrentLook(selectedLook)
      } else {
        setCurrentLook(undefined)
        setErrorMessage(`Unable to load Look ${lookid}`)
      }
    }
  }, [match, looks])

  useEffect(() => {
    if (currentLook) {
      runLook()
    } else {
      setRunningQuery(false)
      setQueryResult('')
    }
  }, [currentLook])

  const loadLooks = async () => {
    setLoadingLooks(true)
    setErrorMessage(undefined)
    try {
      const result = await core40SDK.ok(core40SDK.all_looks())
      setLooks(result.slice(0, 9))
      setLoadingLooks(false)
    } catch (error) {
      setLoadingLooks(false)
      setErrorMessage('Error loading looks')
    }
  }

  const selectLook = (look: ILook) => {
    if (!currentLook || currentLook.id !== look.id) {
      history.push('/' + look.id)
    }
  }

  const runLook = async () => {
    const lookId = currentLook!.id || -1
    try {
      setErrorMessage(undefined)
      setRunningQuery(true)
      const result = await core40SDK.ok(
        core40SDK.run_look({
          look_id: lookId,
          result_format: 'json',
        })
      )
      setRunningQuery(false)
      setQueryResult(result)
      setErrorMessage(undefined)
    } catch (error) {
      setRunningQuery(false)
      setQueryResult('')
      setErrorMessage(`Unable to run look ${lookId}`)
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
            looks={looks}
            selectLook={selectLook}
            currentLookId={currentLook?.id}
          />
          <Switch>
            <Route path="/:id">
              <QueryContainer
                look={currentLook}
                results={queryResult}
                running={runningQuery}
              />
            </Route>
          </Switch>
        </Flex>
      </Box>
    </>
  )
})
