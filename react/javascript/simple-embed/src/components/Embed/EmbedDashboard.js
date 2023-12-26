/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Looker Data Sciences, Inc.
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

import { LookerEmbedSDK } from '@looker/embed-sdk'
import { getExtensionSDK } from '@looker/extension-sdk'
import React, { useCallback, useEffect } from 'react'
import { EmbedContainer } from './EmbedContainer'

const EmbedDashboard = ({ id }) => {
  const [dashboard, setDashboard] = React.useState();
  const extensionSDK = getExtensionSDK();

  useEffect(()=>{
    if (id && dashboard) {
      loadDashboard();
    }
  },[id])

  const loadDashboard = () => {
    dashboard.loadDashboard(id);
  }

  const canceller = (event) => {
    return { cancel: !event.modal }
  }

  const setupDashboard = (dashboard) => {
    setDashboard(dashboard)
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionSDK.lookerHostData.hostUrl
      if (el && hostUrl ) {
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        LookerEmbedSDK.createDashboardWithId(id)
          .withNext()
          .appendTo(el)
          .on('dashboard:loaded', (e)=>console.log(e))
          .on('dashboard:run:start', (e)=>console.log(e))
          .on('dashboard:run:complete', (e)=>console.log(e))
          .on('drillmenu:click', canceller)
          .on('drillmodal:explore', canceller)
          .on('dashboard:tile:explore', canceller)
          .on('dashboard:tile:view', canceller)
          .build()
          .connect()
          .then(setupDashboard)
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    },
    []
  )

  return <EmbedContainer ref={embedCtrRef} />
}

export default EmbedDashboard
