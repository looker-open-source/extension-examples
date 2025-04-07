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
import { EmbedContainer } from './components/EmbedContainer'
import type { EmbedProps } from './types'

const EmbedDashboard: React.FC<EmbedProps> = ({ id }) => {
  const [running, setRunning] = React.useState(false)
  const [connection, setConnection] = React.useState<ILookerConnection>()
  const extensionContext =
    useContext<ExtensionContextData40>(ExtensionContext40)

  const canceller = (event: any) => {
    return { cancel: !event.modal }
  }

  const updateRunButton = (running: boolean) => {
    setRunning(running)
  }

  const setupConnection = (connection: ILookerConnection) => {
    setConnection(connection)
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        el.innerHTML = ''
        getEmbedSDK().init(hostUrl)
        const db = getEmbedSDK().createDashboardWithId(id as number)
        db.appendTo(el)
          .on('dashboard:loaded', updateRunButton.bind(null, false))
          .on('dashboard:run:start', updateRunButton.bind(null, true))
          .on('dashboard:run:complete', updateRunButton.bind(null, false))
          .on('drillmenu:click', canceller)
          .on('drillmodal:explore', canceller)
          .on('dashboard:tile:explore', canceller)
          .on('dashboard:tile:view', canceller)
          .build()
          .connect()
          .then(setupConnection)
          .catch((error: Error) => {
            console.error('Connection error', error)
          })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const runDashboard = () => {
    if (connection) {
      connection.asDashboardConnection().run()
    }
  }

  return (
    <>
      <Heading mt="xlarge">Embedded Dashboard</Heading>
      <SandboxStatus />
      <Button m="medium" onClick={runDashboard} disabled={running}>
        Run Dashboard
      </Button>
      <EmbedContainer ref={embedCtrRef} />
    </>
  )
}

export default EmbedDashboard
