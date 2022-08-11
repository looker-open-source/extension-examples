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
import type { LookerEmbedLook } from '@looker/embed-sdk'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { Button, Heading } from '@looker/components'
import { SandboxStatus } from '../SandboxStatus'
import { EmbedContainer } from './components/EmbedContainer'
import type { EmbedProps } from './types'

const EmbedLook: React.FC<EmbedProps> = ({ id }) => {
  const [running, setRunning] = React.useState(true)
  const [look, setLook] = React.useState<LookerEmbedLook>()
  const extensionContext =
    useContext<ExtensionContextData40>(ExtensionContext40)

  const updateRunButton = (running: boolean) => {
    setRunning(running)
  }

  const setupLook = (look: LookerEmbedLook) => {
    setLook(look)
  }

  const embedCtrRef = useCallback((el) => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl) {
      LookerEmbedSDK.init(hostUrl)
      LookerEmbedSDK.createLookWithId(id as number)
        .appendTo(el)
        .on('look:loaded', updateRunButton.bind(null, false))
        .on('look:run:start', updateRunButton.bind(null, true))
        .on('look:run:complete', updateRunButton.bind(null, false))
        .build()
        .connect()
        .then(setupLook)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [])

  const runLook = () => {
    if (look) {
      look.run()
    }
  }

  return (
    <>
      <Heading mt="xlarge">Embedded Look</Heading>
      <SandboxStatus />
      <Button m="medium" onClick={runLook} disabled={running}>
        Run Look
      </Button>
      <EmbedContainer ref={embedCtrRef} />
    </>
  )
}

export default EmbedLook
