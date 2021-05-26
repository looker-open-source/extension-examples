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
import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ExtensionContext2 } from '@looker/extension-sdk-react'
import { OauthContext } from './OauthProvider'

export const SheetsContext = createContext({})

/**
 * This is the id of a sample sheet provided by Google.
 */
const originalSpreadsheetId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
/**
 * Sheets range. See https://developers.google.com/sheets/api for more details.
 */
const range = 'Class Data!A2:F'

/**
 * Sheets provider
 */
export const SheetsProvider = ({ children }) => {
  const { token } = useContext(OauthContext)
  const [spreadsheetId, setSpreadsheetId] = useState()
  const [expired, setExpired] = useState(false)
  const [error, setError] = useState(false)
  const [rows, setRows] = useState([])
  const { extensionSDK } = useContext(ExtensionContext2)

  /**
   * Low level invocation of the sheets API.
   * Performs primitive error handling.
   */
  const invokeSheetsApi = async (url, init) => {
    try {
      setError(false)
      setExpired(false)
      const { ok, status, body } = await extensionSDK.fetchProxy(url, init)
      setError(!ok)
      if (status === 401) {
        setExpired(true)
      }
      return { ok, body, status }
    } catch (error) {
      console.error(error)
      setError(true)
      return { ok: false }
    }
  }

  /**
   * Load rows for a given spreadsheet id.
   */
  const loadRows = async (requestSpreadsheetId) => {
    setSpreadsheetId(requestSpreadsheetId)
    const { ok, body } = await invokeSheetsApi(
      `https://sheets.googleapis.com/v4/spreadsheets/${requestSpreadsheetId}/values/${range}?access_token=${token}`
    )
    if (ok && body && body.values) {
      setRows(body.values)
    }
  }

  /**
   * Initialize sheets data. Reads sheets data from the Google sample and creates a new
   * sheet using the data. The id of the newly created sheet is stored in the extension
   * context so it is reloaded the next time the extension is executed.
   */
  const init = async () => {
    setRows([])
    let sheetsData
    {
      // Read the sample sheets data.
      const { ok, body } = await invokeSheetsApi(
        `https://sheets.googleapis.com/v4/spreadsheets/${originalSpreadsheetId}?includeGridData=true&access_token=${token}`
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
        const response = await invokeSheetsApi(
          `https://sheets.googleapis.com/v4/spreadsheets?access_token=${token}`,
          {
            method: 'POST',
            body: JSON.stringify(sheetsData),
          }
        )
        ok = response.ok
        body = response.body
      }
      if (ok) {
        // Save the sheet id to the extension context
        await extensionSDK.saveContextData(body.spreadsheetId)
        // Load the data from the newly created spreadsheet.
        loadRows(body.spreadsheetId)
      }
    }
  }

  /**
   * Load the spreadsheet data for the extension. Creates a new spreadsheet if
   * extension context does not contain a spreadsheet id.
   */
  const load = async () => {
    // Get the spreadsheet id.
    const contextData = extensionSDK.getContextData()
    if (contextData) {
      // Got a spreadsheet id so load the rows
      loadRows(contextData)
    } else {
      // No spreadsheet id so create a new spreadsheet from the Google sample.
      init()
    }
  }

  /**
   * Remove a row from the spreadsheet.
   */
  const remove = async (rowIndex) => {
    // row index is based on rows shown. Need to adjust for header.
    const sourceIndex = rowIndex + 1
    const { ok } = await invokeSheetsApi(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0,
                  dimension: 'ROWS',
                  startIndex: sourceIndex,
                  endIndex: sourceIndex + 1,
                },
              },
            },
          ],
        }),
      }
    )
    if (ok) {
      const newRows = [...rows]
      newRows.splice(rowIndex, 1)
      setRows(newRows)
    }
  }

  /**
   * Move a row in the spreadsheet. Either up or down. Only moves the row by an
   * offset of one.
   */
  const move = async (rowIndex, moveUp) => {
    // row index is based on rows shown. Need to adjust for header.
    const sourceIndex = rowIndex + 1
    // moving dest index is one less than source index.
    // moving down, end index is not included in the actual move so
    // add two to get the correct destination index.
    const destIndex = moveUp ? sourceIndex - 1 : sourceIndex + 2
    const { ok } = await invokeSheetsApi(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              moveDimension: {
                source: {
                  sheetId: 0,
                  dimension: 'ROWS',
                  startIndex: sourceIndex,
                  endIndex: sourceIndex + 1,
                },
                destinationIndex: destIndex,
              },
            },
          ],
        }),
      }
    )
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
   */
  const updateAllRows = async (newRows) => {
    const { ok } = await invokeSheetsApi(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valueInputOption: 'RAW',
          data: { range, majorDimension: 'ROWS', values: newRows },
        }),
      }
    )
    return ok
  }

  /**
   * Update a row in the spreadsheet.
   */
  const update = (rowIndex, row) => {
    const newRows = [...rows]
    newRows[rowIndex] = row
    const ok = updateAllRows(newRows)
    if (ok) {
      setRows(newRows)
    }
  }

  /**
   * Insert a row in the spreadsheet.
   */
  const insert = async (rowIndex, row) => {
    const newRows = [...rows]
    newRows.splice(rowIndex, 0, row)
    const ok = updateAllRows(newRows)
    if (ok) {
      setRows(newRows)
    }
  }

  return (
    <SheetsContext.Provider
      value={{
        error,
        expired,
        spreadsheetId,
        rows,
        init,
        load,
        move,
        remove,
        update,
        insert,
      }}
    >
      {children}
    </SheetsContext.Provider>
  )
}

SheetsProvider.propTypes = {
  children: PropTypes.object,
}
