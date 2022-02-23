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

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, List, ListItem, ButtonOutline } from '@looker/components'
import { EmbedEvent } from '../EmbedEvent'

export const EmbedEvents = ({ events, clearEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState()
  const onClearEvents = () => {
    clearEvents()
    setSelectedEvent()
  }
  return (
    <>
      <ButtonOutline width="100%" onClick={onClearEvents}>
        Clear Events
      </ButtonOutline>
      <Box
        height="33%"
        width="100%"
        borderBottom="solid 1px"
        pb="small"
        borderColor="ui2"
        overflowY="scroll"
      >
        <List mt="none" density={-3} width="100%" height="100%">
          {events.map((event, index) => (
            <ListItem
              key={events.length - index}
              onClick={() => setSelectedEvent(event)}
            >
              {event.type}
            </ListItem>
          ))}
        </List>
      </Box>
      <Box height="33%" width="100%" pb="small">
        {selectedEvent && <EmbedEvent embedEvent={selectedEvent} />}
      </Box>
    </>
  )
}

EmbedEvents.propTypes = {
  clearEvents: PropTypes.func,
  events: PropTypes.array,
}
