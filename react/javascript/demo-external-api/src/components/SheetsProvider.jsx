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
import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { OauthContext } from './OauthProvider'

export const SheetsContext = createContext({})

/**
 * Sheets provider that exposes a simple wrapper around the Google
 * sheets restful API.
 */
export const SheetsProvider = ({ children }) => {
  const { token } = useContext(OauthContext)
  const [spreadsheetId, setSpreadsheetId] = useState()
  const [range, setRange] = useState()
  const [expired, setExpired] = useState(false)
  const [error, setError] = useState(false)
  const [rows, setRows] = useState([])
  const { extensionSDK } = useContext(ExtensionContext40)

  /**
   * Low level invocation of the sheets API.
   * Performs primitive error handling.
   *
   * This is a private method.
   */
  const invokeSheetsApi = async (pathname, requestBody) => {
    try {
      const init = requestBody
        ? {
            body: JSON.stringify(requestBody),
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
          }
        : {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: 'GET',
          }

      setError(false)
      setExpired(false)
      const { ok, status, body } = await extensionSDK.fetchProxy(
        `https://sheets.googleapis.com/v4/spreadsheets/${pathname}`,
        init
      )
      setError(!ok)
      if (status === 401) {
        setExpired(true)
      }
      return { body, ok, status }
    } catch (error) {
      console.error(error)
      setError(true)
      return { ok: false }
    }
  }

  /**
   * Unload the currently loaded spreadsheet.
   */
  const unloadSpreadSheet = () => {
    setRows([])
    setSpreadsheetId()
    setRange()
  }

  /**
   * Load the rows for a given spreadsheet id and range.
   */
  const loadSpreadSheet = async (requestSpreadsheetId, requestRange) => {
    setSpreadsheetId(requestSpreadsheetId)
    setRange(requestRange)
    const { ok, body } = await invokeSheetsApi(
      `${requestSpreadsheetId}/values/${requestRange}`
    )
    if (ok && body && body.values) {
      setRows(body.values)
    }
  }

  /**
   * Create a new spreadsheet from the source spread sheet provided.
   */
  const copySpreadsheet = async (sourceSpreadsheetId) => {
    let sheetsData
    {
      const { ok, body } = await invokeSheetsApi(
        `${sourceSpreadsheetId}?includeGridData=true`
      )
      sheetsData = ok ? body : undefined
    }
    if (sheetsData) {
      delete sheetsData.spreadsheetId
      delete sheetsData.spreadsheetUrl
      let ok
      let body
      {
        // Save sample sheets data to a new sheet.
        const response = await invokeSheetsApi('', sheetsData)
        ok = response.ok
        body = response.body
      }
      if (ok) {
        return body.spreadsheetId
      }
    }
  }

  /**
   * Remove a row from the current spreadsheet.
   */
  const removeRowFromSpreadSheet = async (rowIndex) => {
    // row index is based on rows shown. Need to adjust for header.
    const sourceIndex = rowIndex + 1
    const { ok } = await invokeSheetsApi(`${spreadsheetId}:batchUpdate`, {
      requests: [
        {
          deleteDimension: {
            range: {
              dimension: 'ROWS',
              endIndex: sourceIndex + 1,
              sheetId: 0,
              startIndex: sourceIndex,
            },
          },
        },
      ],
    })
    if (ok) {
      const newRows = [...rows]
      newRows.splice(rowIndex, 1)
      setRows(newRows)
    }
  }

  /**
   * Move a row in the current spreadsheet. Either up or down. Only moves the row by an
   * offset of one.
   */
  const moveRowInSpreadSheet = async (rowIndex, moveUp) => {
    // row index is based on rows shown. Need to adjust for header.
    const sourceIndex = rowIndex + 1
    // moving dest index is one less than source index.
    // moving down, end index is not included in the actual move so
    // add two to get the correct destination index.
    const destIndex = moveUp ? sourceIndex - 1 : sourceIndex + 2
    const { ok } = await invokeSheetsApi(`${spreadsheetId}:batchUpdate`, {
      requests: [
        {
          moveDimension: {
            destinationIndex: destIndex,
            source: {
              dimension: 'ROWS',
              endIndex: sourceIndex + 1,
              sheetId: 0,
              startIndex: sourceIndex,
            },
          },
        },
      ],
    })
    if (ok) {
      const newRows = [...rows]
      const offset = moveUp ? -1 : 1
      const saveRow = newRows[rowIndex]
      newRows[rowIndex] = newRows[rowIndex + offset]
      newRows[rowIndex + offset] = saveRow
      setRows(newRows)
    }
  }

  /**
   * Updates all the rows in the spreadsheet (bit of a brute force approach to update or
   * insert a row in the sheet). There are no doubt more efficient ways to do this but
   * this is a demo app.
   *
   * This is a private method.
   */
  const updateAllRowsInSpreadSheet = async (newRows) => {
    const { ok } = await invokeSheetsApi(
      `${spreadsheetId}/values:batchUpdate`,
      {
        data: { majorDimension: 'ROWS', range, values: newRows },
        valueInputOption: 'RAW',
      }
    )
    return ok
  }

  /**
   * Update a row in the current spreadsheet.
   */
  const updateRowInSpreadSheet = (rowIndex, row) => {
    const newRows = [...rows]
    newRows[rowIndex] = row
    const ok = updateAllRowsInSpreadSheet(newRows)
    if (ok) {
      setRows(newRows)
    }
  }

  /**
   * Insert a row in the current spreadsheet.
   */
  const insertRowInSpreadSheet = async (rowIndex, row) => {
    const newRows = [...rows]
    newRows.splice(rowIndex, 0, row)
    const ok = updateAllRowsInSpreadSheet(newRows)
    if (ok) {
      setRows(newRows)
    }
  }

  return (
    <SheetsContext.Provider
      value={{
        copySpreadsheet,
        error,
        expired,
        insertRowInSpreadSheet,
        loadSpreadSheet,
        moveRowInSpreadSheet,
        removeRowFromSpreadSheet,
        rows,
        spreadsheetId,
        unloadSpreadSheet,
        updateRowInSpreadSheet,
      }}
    >
      {children}
    </SheetsContext.Provider>
  )
}

SheetsProvider.propTypes = {
  children: PropTypes.object,
}
