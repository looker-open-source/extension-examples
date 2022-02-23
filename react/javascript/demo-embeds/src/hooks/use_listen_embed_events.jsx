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
import { useState } from 'react'
export const useListenEmbedEvents = () => {
  const [embedEvents, setEmbedEvents] = useState([])

  const clearEvents = () => {
    setEmbedEvents([])
  }

  const listenEmbedEvents = (embed) => {
    const eventTypes = [
      'dashboard:run:start',
      'dashboard:run:complete',
      'dashboard:filters:changed',
      'dashboard:save:complete',
      'dashboard:delete:complete',
      'dashboard:tile:start',
      'dashboard:tile:complete',
      'dashboard:tile:download',
      'dashboard:tile:explore',
      'dashboard:tile:view',
      'drillmenu:click',
      'drillmodal:explore',
      'explore:run:start',
      'explore:run:complete',
      'explore:ready',
      'explore:state:changed',
      'look:run:start',
      'look:run:complete',
      'look:save:complete',
      'look:delete:complete',
      'look:ready',
      'look:state:changed',
      'page:changed',
      'page:properties:changed',
    ]
    eventTypes.forEach((type) =>
      embed.on(type, (e) => {
        setEmbedEvents((prev) => [e, ...prev])
        return {}
      })
    )
  }

  return { clearEvents, embedEvents, listenEmbedEvents }
}
