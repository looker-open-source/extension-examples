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

import React, { useEffect, useReducer } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import {
  MessageBar,
  Box,
  Divider,
  Heading,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@looker/components'
import { SandboxStatus } from '../SandboxStatus'
import type { ExternalApiFunctionsProps } from './types'
import { Auth } from './components/Auth'
import { DataServerDemo } from './components/DataServerDemo'
import { GoogleSheetsDemo } from './components/GoogleSheetsDemo'
import {
  initialState as dataInitialState,
  reducer as dataReducer,
  updateErrorMessage,
} from './data/DataReducer'

/**
 * External API demonstration. Demonstrates the following:
 * 1. The external API fetch proxy accessing a simple json data server.
 * 2. Oauth2 authorization with Google (implicit OAUTH2 flow). Note that other
 *    Oauth2 providers that support the implicit OAUTH2 flow can be used.
 * 3. Google sheets demo.
 */
const ExternalApiFunctions: React.FC<ExternalApiFunctionsProps> = () => {
  // State is stored here as asynchronous actions may complete
  // after components unload. If components own state, react puts messages
  // on the console.
  const [dataState, dataDispatch] = useReducer(dataReducer, dataInitialState)

  // React router setup
  const history = useHistory()
  const location = useLocation()
  const match = useRouteMatch<{ func: string; tab: string }>('/:func/:tab')

  // Onetime initial setup for the component
  useEffect(() => {
    const tabIndex = parseInt(match?.params?.tab || '-1')
    // If tab index not in the URL, add it.
    if (tabIndex < 0 || tabIndex > 1) {
      history.push(`${location.pathname}/0`, location.state)
    }
  }, [])

  // Tab handling. Current tab is stored in URL so that it can be restored on
  // page reload.
  let selectedIndex = match ? Number(match.params.tab) : 0
  selectedIndex = isNaN(selectedIndex) ? -1 : selectedIndex
  const onSelectTab = (index: number) => {
    const tabIndex = parseInt(match?.params?.tab || '-1')
    if (tabIndex !== index) {
      history.push(`/${match?.params?.func}/${index}`, location.state)
    }
  }

  // Close the error message banner
  const onDismiss = () => {
    updateErrorMessage(dataDispatch, undefined)
  }

  // Get data from state. The user needs to be authorized to see the demos
  const { errorMessage } = dataState
  const { jwtToken } = (location.state as any) || {}

  return (
    <>
      <Heading mt="xlarge">External API Functions</Heading>
      <SandboxStatus />
      {errorMessage && (
        <MessageBar intent="critical" onPrimaryClick={onDismiss}>
          {errorMessage}
        </MessageBar>
      )}
      <Box padding="small">
        <Divider />
        <Auth dataDispatch={dataDispatch} dataState={dataState} />
        <Divider />
        {jwtToken && (
          <>
            <TabList selectedIndex={selectedIndex} onSelectTab={onSelectTab}>
              <Tab>Data Server Demo</Tab>
              <Tab>Google Sheets Demo</Tab>
            </TabList>
            <TabPanels selectedIndex={selectedIndex}>
              <TabPanel>
                <DataServerDemo
                  dataDispatch={dataDispatch}
                  dataState={dataState}
                />
              </TabPanel>
              <TabPanel>
                <GoogleSheetsDemo
                  dataDispatch={dataDispatch}
                  dataState={dataState}
                />
              </TabPanel>
            </TabPanels>
          </>
        )}
      </Box>
    </>
  )
}

export default ExternalApiFunctions
