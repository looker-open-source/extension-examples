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

import React, { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { DataTableColumns } from '@looker/components'
import { DataTable, DataTableItem, DataTableCell } from '@looker/components'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { updateErrorMessage, updateSheetData } from '../../data/DataReducer'
import { GOOGLE_CLIENT_ID, AuthOption, POSTS_SERVER_URL } from '../..'
import { handleResponse, handleError } from '../../utils/validate_data_response'
import { getDataServerFetchProxy } from '../../utils/fetch_proxy'

import type { GoogleSheetsDemoProps } from './types'

/**
 * Demonstrate usage of the google sheets API via the extension sdk fetch proxy
 */
export const GoogleSheetsDemo: React.FC<GoogleSheetsDemoProps> = ({
  dataDispatch,
  dataState,
}) => {
  // Get access to the extension SDK and the looker API SDK.
  const extensionContext =
    useContext<ExtensionContextData40>(ExtensionContext40)
  const { extensionSDK } = extensionContext

  // React router setup
  const location = useLocation()

  useEffect(() => {
    // Create a function so that async/await can be used in useEffect
    const fetchData = async () => {
      // Make sure the google client id has been defined
      if (GOOGLE_CLIENT_ID === '') {
        updateErrorMessage(
          dataDispatch,
          'Google client id has not been defined. Please see README.md for instructions.'
        )
      } else {
        const { googleAccessToken, authOption } = location.state as any
        const spreadsheetId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
        const range = 'Class Data!A2:E'
        try {
          if (authOption === AuthOption.Google) {
            // The sheets API can be accessed directly when google is the OAUTH provider.
            if (!googleAccessToken) {
              // This should not happen
              updateErrorMessage(dataDispatch, 'Google access token is missing')
            } else {
              // Read the spread sheet. Note that the spreadsheet id comes from the Google Sheets
              // Browser quick start demo
              // https://developers.google.com/sheets/api/quickstart/js
              const response = await extensionSDK.fetchProxy(
                `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?access_token=${googleAccessToken}`
              )
              if (handleResponse(response, dataDispatch)) {
                const values: any[] = response.body?.values || []
                updateSheetData(dataDispatch, values)
              }
            }
          } else {
            // If use is not logged in using google OAUTH the sheet is read using a
            // proxy call to the data server. The data server will check to see if the
            // user is authorized to make the call by checking the JWT token.
            const dataServerFetchProxy = getDataServerFetchProxy(
              extensionSDK,
              location.state
            )
            const response = await dataServerFetchProxy.fetchProxy(
              `${POSTS_SERVER_URL}/sheets/${spreadsheetId}/${range}`
            )
            if (handleResponse(response, dataDispatch)) {
              const values: any[] = response.body?.values || []
              updateSheetData(dataDispatch, values)
            }
          }
        } catch (error) {
          handleError(error, dispatchEvent)
        }
      }
    }
    // useEffect does not support async/await directly. Fake it with
    // a function
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { sheetData } = dataState

  // Sheet column definitions for action list
  const sheetColumns: DataTableColumns = [
    {
      id: 'name',
      title: 'Name',
      type: 'string',
      size: 'medium',
    },
    {
      id: 'sex',
      title: 'Sex',
      type: 'string',
      size: 'medium',
    },
    {
      id: 'collegeYear',
      title: 'Year',
      type: 'string',
      size: 'medium',
    },
    {
      id: 'state',
      title: 'State',
      type: 'string',
      size: 'medium',
    },
    {
      id: 'major',
      title: 'Major',
      type: 'string',
      size: 'medium',
    },
  ]

  // render posts action list columns
  const sheetItems = (sheetData || []).map((sheetRow: any[]) => {
    // The column data
    const [name, sex, collegeYear, state, major] = sheetRow
    return (
      <DataTableItem key={name} id={name}>
        <DataTableCell>{name}</DataTableCell>
        <DataTableCell>{sex}</DataTableCell>
        <DataTableCell>{collegeYear}</DataTableCell>
        <DataTableCell>{state}</DataTableCell>
        <DataTableCell>{major}</DataTableCell>
      </DataTableItem>
    )
  })

  return (
    <>
      {sheetData && (
        <DataTable columns={sheetColumns} caption="Sheet items">
          {sheetItems}
        </DataTable>
      )}
    </>
  )
}
