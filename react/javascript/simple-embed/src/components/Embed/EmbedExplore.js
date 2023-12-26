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
import React, { useCallback } from 'react'
import { EmbedContainer } from './EmbedContainer'

const EmbedExplore = ({ id }) => {
  const [explore, setExplore] = React.useState();
  const extensionSDK = getExtensionSDK();

  const setupExplore = (explore) => {
    setExplore(explore)
  }

  const embedCtrRef = useCallback((el) => {
    const hostUrl = extensionSDK.lookerHostData.hostUrl
    if (el && hostUrl) {
      el.innerHTML = '';
      LookerEmbedSDK.init(hostUrl)
      LookerEmbedSDK.createExploreWithId(id)
        .appendTo(el)
        .on('explore:ready', (e)=>console.log(e))
        .on('explore:run:start', (e)=>console.log(e))
        .on('explore:run:complete', (e)=>console.log(e))
        .build()
        .connect()
        .then(setupExplore)
        .catch((error) => {
          console.error('Connection error', error)
        })
    }
  }, [id])

  return <EmbedContainer ref={embedCtrRef} />
}

export default EmbedExplore
