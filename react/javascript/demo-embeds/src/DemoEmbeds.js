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

import React, { useContext, useState, useEffect, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {
  Button,
  ButtonOutline,
  Layout,
  Aside,
  MessageBar,
  Box,
  Space,
  SpaceVertical,
  Heading,
  FieldToggleSwitch,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { getEmbedSDK } from '@looker/embed-sdk'
import { me } from '@looker/sdk'
import { EmbedContainer } from './components/EmbedContainer'
import { Content } from './components/Content'

const validContentTypes = ['explore', 'dashboards', 'looks', 'reporting']

const getInitialEmbedUrl = (pathname) => {
  const pathNodes = pathname.split('/')
  if (pathNodes.length < 3 || !validContentTypes.includes(pathNodes[1])) {
    return '/embed/preload'
  }
  if (pathNodes.length < 4) {
    return `/embed/${pathNodes[1]}/${pathNodes[2]}`
  }
  return `/embed/${pathNodes[1]}/${pathNodes[2]}/${pathNodes[3]}`
}

const getSelectedContentTypeAndId = (pathname) => {
  const pathNodes = pathname.split('/')
  if (pathNodes.length < 3 || !validContentTypes.includes(pathNodes[1])) {
    return {}
  }
  if (pathNodes.length < 4) {
    return {
      selectedContentType: pathNodes[1],
      selectedId: pathNodes[2],
    }
  }
  return {
    selectedContentType: pathNodes[1],
    selectedId: `${pathNodes[2]}/${pathNodes[3]}`,
  }
}

export const DemoEmbeds = () => {
  const { pathname } = useLocation()
  const history = useHistory()
  const embedCtrRef = useRef()
  const preventNavigationRef = useRef(true)
  const { extensionSDK } = useContext(ExtensionContext40)
  const [message, setMessage] = useState()
  const [status, setStatus] = useState()
  const [running, setRunning] = useState(true)
  const [connection, setConnection] = useState()
  const [preventNavigation, setPreventNavigation] = useState(true)
  const { selectedContentType, selectedId } =
    getSelectedContentTypeAndId(pathname)

  const setupConnection = (connection) => {
    setConnection(connection)
  }

  const onDashboardRunStart = () => {
    setStatus('Dashboard run started.')
    setRunning(true)
  }

  const onDashboardRunComplete = () => {
    setStatus('Dashboard run completed.')
    setRunning(false)
  }

  const onExploreReady = () => {
    setStatus('Explore ready.')
    setRunning(false)
  }

  const onExploreRunStart = () => {
    setStatus('Explore run started.')
    setRunning(true)
  }

  const onExploreRunComplete = () => {
    setStatus('Explore run completed.')
    setRunning(false)
  }

  const onLookReady = () => {
    setStatus('Look ready.')
    setRunning(false)
  }

  const onLookRunStart = () => {
    setStatus('Look run started.')
    setRunning(true)
  }

  const onLookRunComplete = () => {
    setStatus('Look run completed.')
    setRunning(false)
  }

  const onPageChanged = () => {
    if (
      selectedContentType !== 'dashboards' &&
      selectedContentType !== 'looks' &&
      selectedContentType !== 'explore'
    ) {
      setStatus('New content loaded.')
    }
  }

  const createConnection = async ({ hostUrl, embedUrl, el }) => {
    try {
      setStatus('Initializing embed ...')
      getEmbedSDK().init(hostUrl)
      const builder = getEmbedSDK()
        .createWithUrl(embedUrl)
        .appendTo(el)
        .on('dashboard:run:start', onDashboardRunStart)
        .on('dashboard:run:complete', onDashboardRunComplete)
        .on('explore:ready', onExploreReady)
        .on('explore:run:start', onExploreRunStart)
        .on('explore:run:complete', onExploreRunComplete)
        .on('look:ready', onLookReady)
        .on('look:run:start', onLookRunStart)
        .on('look:run:complete', onLookRunComplete)
        .on('drillmenu:click', drillMenuClicked)
        .on('drillmodal:explore', drillModalExplore)
        .on('dashboard:tile:explore', tileExplore)
        .on('dashboard:tile:view', tileView)
        .on('page:changed', onPageChanged)
      const connection = await builder
        .build()
        .connect({ waitUntilLoaded: true })
      setupConnection(connection)
    } catch (error) {
      console.error('Connection error', error)
      setMessage({ intent: 'critical', text: 'Error loading embed' })
    }
    if (
      selectedContentType === 'dashboards' ||
      selectedContentType === 'looks' ||
      selectedContentType === 'explore'
    ) {
      setStatus('Embed initialized ...')
    } else {
      setStatus('Embed loaded')
      setRunning(false)
    }
  }

  const loadContent = async () => {
    if (connection) {
      const url = pathname === '/' ? '/preload' : pathname
      try {
        setRunning(true)
        await connection.loadUrl({
          options: { waitUntilLoaded: true },
          url,
        })
      } catch (error) {
        console.error(error)
        setMessage({
          intent: 'critical',
          text: 'Error occured loading content',
        })
      }
      if (
        selectedContentType !== 'dashboards' &&
        selectedContentType !== 'looks' &&
        selectedContentType !== 'explore'
      ) {
        setRunning(false)
      }
    }
  }

  const navigate = (newPathname) => {
    if (!connection) {
      setMessage({
        intent: 'critical',
        text: 'Embedded content is not currently available',
      })
    } else if (connection.isEditing()) {
      setMessage({
        intent: 'critical',
        text: 'Navigation to different content is disabled while the current content is being edited',
      })
    } else {
      setMessage(undefined)
      if (newPathname !== pathname) {
        setStatus('Load new content')
        history.push(newPathname)
      }
    }
  }

  const onSelected = (contentType, id) => {
    navigate(`/${contentType}/${id}`)
  }

  const onUnload = () => {
    navigate('/')
  }

  const onRun = () => {
    if (connection) {
      if (connection.getPageType() === 'dashboards') {
        connection.asDashboardConnection().run()
      } else if (connection.getPageType() === 'explore') {
        connection.asExploreConnection().run()
      } else if (connection.getPageType() === 'looks') {
        connection.asLookConnection().run()
      }
    }
  }

  const onStop = () => {
    if (connection) {
      if (connection.getPageType() === 'dashboards') {
        connection.asDashboardConnection().stop()
      }
    }
  }

  const onEdit = () => {
    if (connection) {
      if (connection.getPageType() === 'dashboards') {
        connection.asDashboardConnection().edit()
      }
    }
  }

  const drillMenuClicked = (event) => {
    if (preventNavigationRef.current) {
      setStatus('Drill menu click cancelled')
    } else {
      setStatus('Drill menu click allowed')
    }
    return { cancel: preventNavigationRef.current }
  }

  const drillModalExplore = (event) => {
    if (preventNavigationRef.current) {
      setStatus('Drill modal explore click cancelled')
    } else {
      setStatus('Drill modal explore click allowed')
    }
    return { cancel: preventNavigationRef.current }
  }

  const tileExplore = (event) => {
    if (preventNavigationRef.current) {
      setStatus('Tile explore click cancelled')
    } else {
      setStatus('Tile explore click allowed')
    }
    return { cancel: preventNavigationRef.current }
  }

  const tileView = (event) => {
    if (preventNavigationRef.current) {
      setStatus('Tile view click cancelled')
    } else {
      setStatus('Tile view click allowed')
    }
    return { cancel: preventNavigationRef.current }
  }

  const togglePreventNavigation = () => {
    setPreventNavigation(!preventNavigation)
    // Need to use a ref as embed sdk callbacks are not aware of react state
    preventNavigationRef.current = !preventNavigation
  }

  const onLoadError = (errorMessage) => {
    if (message?.text !== errorMessage) {
      setMessage({
        intent: 'critical',
        text: errorMessage,
      })
    }
  }

  useEffect(
    () => {
      if (embedCtrRef.current) {
        const el = embedCtrRef.current
        const hostUrl = extensionSDK.lookerHostData?.hostUrl
        if (hostUrl) {
          createConnection({
            el,
            embedUrl: getInitialEmbedUrl(pathname),
            hostUrl,
          })
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(
    () => {
      loadContent()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  )

  return (
    <View>
      <SpaceVertical width="100%">
        {message && (
          <MessageBar intent={message.intent}>{message.text}</MessageBar>
        )}
        <StyledHeading>Extension Embed Demo</StyledHeading>
        <Space pb="small" width="100%">
          <Button disabled={running} onClick={onUnload}>
            Unload
          </Button>
          {selectedContentType !== 'reporting' && (
            <ButtonOutline disabled={running} onClick={onRun}>
              Run
            </ButtonOutline>
          )}
          {selectedContentType === 'dashboards' && (
            <ButtonOutline disabled={running} onClick={onStop}>
              Stop
            </ButtonOutline>
          )}
          {selectedContentType === 'dashboards' && (
            <ButtonOutline disabled={running} onClick={onEdit}>
              Edit
            </ButtonOutline>
          )}
          {selectedContentType === 'dashboards' && (
            <FieldToggleSwitch
              label="Prevent navigation"
              disabled={running}
              onChange={togglePreventNavigation}
              on={preventNavigation}
            />
          )}
        </Space>
        <Box height="45px" width="100%" borderTop borderBottom padding="small">
          {status}
        </Box>
      </SpaceVertical>
      <StyledLayout hasAside height="100%">
        <Aside width="250px" height="100%" pr="small">
          <Content
            onSelected={onSelected}
            selectedContentType={selectedContentType}
            selectedId={selectedId}
            running={running}
            onLoadError={onLoadError}
          />
        </Aside>
        <EmbedContainer ref={embedCtrRef} />
      </StyledLayout>
    </View>
  )
}

const StyledHeading = styled(Heading)`
  width: 100%;
  text-align: center;
  paddimg-top: 10px;
`

const View = styled(Box)`
  margin-left: 5px;
  height: calc(100vh - 20px);
  display: flex;
  flex-direction: column;
`

const StyledLayout = styled(Layout)`
  margin-top: 5px;
  width: 100%;
  flex-grow: 1;
  border: 0;
`
