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

import React, { useCallback, useContext } from 'react'
import { Button, Heading } from '@looker/components'
import type { ILookerConnection } from '@looker/embed-sdk'
import { getEmbedSDK } from '@looker/embed-sdk'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { SandboxStatus } from '../SandboxStatus'
import type { EmbedProps } from './types'
import { EmbedContainer } from './components/EmbedContainer'

const EmbedExplore: React.FC<EmbedProps> = ({ id }) => {
  const [running, setRunning] = React.useState(true)
  const [connection, setConnection] = React.useState<ILookerConnection>()
  const extensionContext =
    useContext<ExtensionContextData40>(ExtensionContext40)

  const updateRunButton = (running: boolean) => {
    setRunning(running)
  }

  const setupConnection = (connection: ILookerConnection) => {
    setConnection(connection)
  }

  const embedCtrRef = useCallback((el) => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl) {
      getEmbedSDK().init(hostUrl)
      getEmbedSDK()
        .createExploreWithId(id as string)
        .appendTo(el)
        .on('explore:ready', updateRunButton.bind(null, false))
        .on('explore:run:start', updateRunButton.bind(null, true))
        .on('explore:run:complete', updateRunButton.bind(null, false))
        .build()
        .connect()
        .then(setupConnection)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const runExplore = () => {
    if (connection) {
      connection.asExploreConnection().run()
    }
  }

  return (
    <>
      <Heading mt="xlarge">Embedded Explore</Heading>
      <SandboxStatus />
      <Button m="medium" onClick={runExplore} disabled={running}>
        Run Explore
      </Button>
      <EmbedContainer ref={embedCtrRef} />
    </>
  )
}

export default EmbedExplore
