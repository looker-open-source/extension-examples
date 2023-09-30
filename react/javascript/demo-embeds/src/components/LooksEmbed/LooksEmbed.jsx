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

import React, { useCallback, useContext, useState, useEffect } from 'react'
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
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import {
  useAllLooks,
  useCurrentRoute,
  useNavigate,
  useListenEmbedEvents,
} from '../../hooks'
import { Search } from '../Search'
import { EmbedContainer } from '../EmbedContainer'
import { EmbedEvents } from '../EmbedEvents'

export const LooksEmbed = ({ embedType }) => {
  const { embedId } = useCurrentRoute(embedType)
  const { updateEmbedId } = useNavigate(embedType)
  const { extensionSDK } = useContext(ExtensionContext40)
  const [message, setMessage] = useState()
  const [running, setRunning] = useState()
  const [lookId, setLookId] = useState()
  const [look, setLook] = useState()
  const { data, isLoading, error } = useAllLooks()
  const results = (data || []).map(({ id, title }) => ({
    description: title,
    id,
  }))
  const { embedEvents, listenEmbedEvents, clearEvents } = useListenEmbedEvents()

  useEffect(() => {
    if (lookId !== embedId) {
      if (lookId) {
        updateEmbedId(lookId + '')
        setMessage(undefined)
      } else {
        if (embedId && embedId !== '') {
          setLookId(embedId)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookId, embedId])

  const updateRunButton = (running) => {
    setRunning(running)
  }

  const setupLook = (look) => {
    setLook(look)
  }

  const embedCtrRef = useCallback(
    (el) => {
      setMessage(undefined)
      if (lookId) {
        if (el) {
          setRunning(true)
          el.innerHTML = ''
          const hostUrl = extensionSDK.lookerHostData?.hostUrl
          if (hostUrl) {
            LookerEmbedSDK.init(hostUrl)
            const embed = LookerEmbedSDK.createLookWithId(lookId)
              .appendTo(el)
              .on('look:loaded', updateRunButton.bind(null, false))
              .on('look:run:start', updateRunButton.bind(null, true))
              .on('look:run:complete', updateRunButton.bind(null, false))
            listenEmbedEvents(embed)
            embed
              .build()
              .connect()
              .then(setupLook)
              .catch((error) => {
                console.error('Connection error', error)
                setMessage('Error loading embed')
              })
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lookId]
  )

  const onSelected = (id) => {
    if (id !== lookId) {
      setLookId(id)
    }
  }

  const runLook = () => {
    if (look) {
      look.run()
    }
  }

  return (
    <Page height="100%">
      <Layout hasAside height="100%">
        <Section height="100%" px="small">
          <>
            {message && <MessageBar intent="critical">{message}</MessageBar>}
            <Box py="5px">
              <Button onClick={runLook} disabled={!lookId || running}>
                Run Look
              </Button>
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
            />
            <EmbedEvents events={embedEvents} clearEvents={clearEvents} />
          </SpaceVertical>
        </Aside>
      </Layout>
    </Page>
  )
}

LooksEmbed.propTypes = {
  embedType: PropTypes.string.isRequired,
}
