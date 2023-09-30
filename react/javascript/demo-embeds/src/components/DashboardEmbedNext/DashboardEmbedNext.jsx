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

import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Layout,
  Page,
  Aside,
  Section,
  MessageBar,
  Box,
  SpaceVertical,
  FieldToggleSwitch,
  Space,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import {
  useCurrentRoute,
  useNavigate,
  useListenEmbedEvents,
  useAllDashboards,
} from '../../hooks'
import { Search } from '../Search'
import { EmbedContainer } from '../EmbedContainer'
import { EmbedEvents } from '../EmbedEvents'

export const DashboardEmbedNext = ({ embedType }) => {
  const [cancelEvents, setCancelEvents] = useState(true)
  const cancelEventsRef = useRef()
  cancelEventsRef.current = cancelEvents
  const { embedId } = useCurrentRoute(embedType)
  const { updateEmbedId } = useNavigate(embedType)
  const { extensionSDK } = useContext(ExtensionContext40)
  const [message, setMessage] = useState()
  const [running, setRunning] = useState(false)
  const [dashboardId, setDashboardId] = useState()
  const [dashboard, setDashboard] = useState()
  const { embedEvents, listenEmbedEvents, clearEvents } = useListenEmbedEvents()
  const { data, isLoading, error } = useAllDashboards()
  const results = (data || []).map(({ id, title }) => ({
    description: title,
    id,
  }))

  useEffect(() => {
    if (dashboardId && dashboardId !== embedId) {
      if (dashboard) {
        updateEmbedId(dashboardId)
        dashboard.loadDashboard(dashboardId)
        setMessage(undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardId, embedId, dashboard])

  const maybeCancel = () => {
    return { cancel: cancelEventsRef.current }
  }

  const updateRunButton = (running) => {
    setRunning(running)
  }

  const setupDashboard = (dashboard) => {
    setDashboard(dashboard)
  }

  const embedCtrRef = useCallback((el) => {
    setMessage(undefined)
    if (el) {
      const hostUrl = extensionSDK.lookerHostData?.hostUrl
      if (hostUrl) {
        let initialId
        if (embedId && embedId !== '') {
          setDashboardId(embedId)
          initialId = embedId
        } else {
          initialId = 'preload'
        }
        LookerEmbedSDK.init(hostUrl)
        const embed = LookerEmbedSDK.createDashboardWithId(initialId)
          .withNext()
          .appendTo(el)
          .on('dashboard:run:start', updateRunButton.bind(null, true))
          .on('dashboard:run:complete', updateRunButton.bind(null, false))
          .on('drillmenu:click', maybeCancel)
          .on('drillmodal:explore', maybeCancel)
          .on('dashboard:tile:explore', maybeCancel)
          .on('dashboard:tile:view', maybeCancel)
        listenEmbedEvents(embed)
        if (initialId === 'preload') {
          embed.on('page:changed', updateRunButton.bind(null, false))
        }
        embed
          .build()
          .connect()
          .then(setupDashboard)
          .catch((error) => {
            console.error('Connection error', error)
            setMessage('Error setting up embed environment')
          })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSelected = (id) => {
    if (id !== dashboardId) {
      setDashboardId(id)
    }
  }

  const toggleCancelEvents = async (e) => {
    setCancelEvents(e.target.checked)
  }

  const runDashboard = () => {
    if (dashboard) {
      dashboard.run()
    }
  }

  return (
    <Page height="100%">
      <Layout hasAside height="100%">
        <Section height="100%" px="small">
          <>
            {message && <MessageBar intent="critical">{message}</MessageBar>}
            <Box py="5px">
              <Space>
                <Button
                  onClick={runDashboard}
                  disabled={!dashboardId || running}
                >
                  Run Dashboard
                </Button>
                <FieldToggleSwitch
                  label="Cancel embed events"
                  onChange={toggleCancelEvents}
                  on={cancelEvents}
                />
              </Space>
            </Box>
            <EmbedContainer ref={embedCtrRef} />
          </>
        </Section>
        <Aside width="25%" height="100%" pr="small">
          <SpaceVertical height="100%">
            <Search
              onSelected={onSelected}
              loading={isLoading}
              error={error}
              data={results}
              embedRunning={running}
              embedType={embedType}
            />
            <EmbedEvents events={embedEvents} clearEvents={clearEvents} />
          </SpaceVertical>
        </Aside>
      </Layout>
    </Page>
  )
}

DashboardEmbedNext.propTypes = {
  embedType: PropTypes.string.isRequired,
}
