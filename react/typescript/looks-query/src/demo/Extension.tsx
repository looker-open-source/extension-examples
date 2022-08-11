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

import React, { useState, useEffect, useContext } from 'react'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { MessageBar, Box, Heading, Flex } from '@looker/components'
import type { ILook } from '@looker/sdk'
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom'
import { QueryContainer } from './QueryContainer'
import { LookList } from './LookList'

export const Extension: React.FC = () => {
  const [loadingLooks, setLoadingLooks] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [looks, setLooks] = useState<ILook[]>([])
  const [currentLook, setCurrentLook] = useState<ILook>()
  const [runningQuery, setRunningQuery] = useState<boolean>(false)
  const [queryResult, setQueryResult] = useState<Record<any, any>[]>([])

  const extensionContext =
    useContext<ExtensionContextData40>(ExtensionContext40)
  const { coreSDK } = extensionContext
  const history = useHistory()
  const match = useRouteMatch<{ lookid: string }>('/:lookid')

  useEffect(() => {
    loadLooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const lookid = match?.params.lookid
    if (looks.length > 0) {
      if (lookid) {
        const selectedLook = looks.find((look) => look.id === lookid)
        if (selectedLook && (!currentLook || currentLook.id !== selectedLook)) {
          setCurrentLook(selectedLook)
        } else {
          setCurrentLook(undefined)
          setErrorMessage(`Unable to load Look ${lookid}`)
        }
      } else {
        selectLook(looks[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, looks])

  useEffect(() => {
    if (currentLook) {
      runLook()
    } else {
      setRunningQuery(false)
      setQueryResult([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLook])

  const loadLooks = async () => {
    setLoadingLooks(true)
    setErrorMessage(undefined)
    try {
      const result = await coreSDK.ok(coreSDK.all_looks())
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
    const lookId = currentLook?.id || ''
    try {
      setErrorMessage(undefined)
      setRunningQuery(true)
      const result = (await coreSDK.ok(
        coreSDK.run_look({
          look_id: lookId,
          result_format: 'json',
        })
      )) as unknown as Record<any, any>[]
      setRunningQuery(false)
      setQueryResult(result)
      setErrorMessage(undefined)
    } catch (error) {
      setRunningQuery(false)
      setQueryResult([])
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
}
