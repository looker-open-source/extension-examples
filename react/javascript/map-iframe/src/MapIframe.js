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
import {
  Box,
  ComponentsProvider,
  Grid,
  DataTable,
  DataTableItem,
  DataTableCell,
} from '@looker/components'
import capitals from 'country-json/src/country-by-capital-city.json'

const GOOGLE_MAPS_EMBED_API_KEY = encodeURIComponent(
  process.env.GOOGLE_MAPS_EMBED_API_KEY
)

export const MapIframe = () => {
  const [searchCriteria, setSearchCriteria] = useState()

  const columns = [
    {
      id: 'city',
      size: 'medium',
      title: 'City',
      type: 'string',
    },
    {
      id: 'country',
      size: 'medium',
      title: 'Country',
      type: 'string',
    },
  ]

  return (
    <ComponentsProvider
      themeCustomizations={{
        colors: { key: '#1A73E8' },
      }}
    >
      <Grid m="large">
        <Box width="100%" height="95vh" overflow="auto">
          <DataTable captions="Countries" columns={columns}>
            {capitals.map(({ city, country }, index) => {
              return (
                <DataTableItem
                  key={index}
                  id={index}
                  onClick={() => setSearchCriteria(`${city}+${country}`)}
                >
                  <DataTableCell>{city}</DataTableCell>
                  <DataTableCell>{country}</DataTableCell>
                </DataTableItem>
              )
            })}
          </DataTable>
        </Box>
        <Box height="95vh" width="100%">
          {searchCriteria && (
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_EMBED_API_KEY}&q=${searchCriteria}`}
            ></iframe>
          )}
        </Box>
      </Grid>
    </ComponentsProvider>
  )
}
