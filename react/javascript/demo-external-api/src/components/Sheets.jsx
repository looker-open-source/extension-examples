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

import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonOutline,
  Heading,
  Code,
  Space,
  Tooltip,
  useConfirm,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { SheetsContext } from './SheetsProvider'
import { SheetsTable } from './SheetsTable'
import { SheetsForm } from './SheetsForm'

/**
 * This is the id of a sample sheet provided by Google. It is used to create
 * an initial spreadsheet to edit. A new spreadsheet can be created at any
 * time by pressing the recreate sheet from source button.
 */
const sourceSpreadsheetId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
/**
 * Sheets range. See https://developers.google.com/sheets/api for more details.
 */
const range = 'Class Data!A2:F'

/**
 * Main sheets component.
 */
export const Sheets = ({ signOut, token, updateMessage, clearMessage }) => {
  const { extensionSDK } = useContext(ExtensionContext40)
  const {
    unloadSpreadSheet,
    copySpreadsheet,
    loadSpreadSheet,
    moveRowInSpreadSheet,
    removeRowFromSpreadSheet,
    updateRowInSpreadSheet,
    insertRowInSpreadSheet,
    spreadsheetId,
    rows,
    error,
    expired,
  } = useContext(SheetsContext)
  const [rowToDeleteName, setRowToDeleteName] = useState()
  const [activeIndex, setActiveIndex] = useState()
  const [insertRow, setInsertRow] = useState()
  const [showForm, setShowForm] = useState()

  useEffect(() => {
    const initialize = async () => {
      const contextData = extensionSDK.getContextData()
      if (contextData) {
        await loadSpreadSheet(contextData, range)
      } else {
        const spreadsheetId = await copySpreadsheet(sourceSpreadsheetId)
        if (spreadsheetId) {
          await extensionSDK.saveContextData(spreadsheetId)
          await loadSpreadSheet(spreadsheetId, range)
        }
      }
    }
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, extensionSDK])

  const recreateFromSource = async () => {
    unloadSpreadSheet()
    const spreadsheetId = await copySpreadsheet(sourceSpreadsheetId)
    if (spreadsheetId) {
      await extensionSDK.saveContextData(spreadsheetId)
      await loadSpreadSheet(spreadsheetId, range)
    }
  }

  const [deleteConfirmDialog, openDeleteConfirmDialog] = useConfirm({
    buttonColor: 'critical',
    confirm: 'Yes, delete row from sheet',
    message: `Are you sure you want to delete the row with name ${rowToDeleteName} from the sheet?`,
    onCancel: (close) => {
      close()
    },
    onConfirm: (close) => {
      removeRowFromSpreadSheet(activeIndex)
      close()
    },
    title: 'Delete row from sheet',
  })

  useEffect(() => {
    if (expired) {
      updateMessage('Session expired')
      signOut()
    } else if (error) {
      updateMessage('An error occured accessing the sheets data.')
    } else {
      clearMessage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired, error])

  // Open up a dialog to add a new row to the spread sheet
  const onRowInsert = (index) => {
    setActiveIndex(index)
    setInsertRow(true)
    setShowForm(true)
  }

  // Open up a dialog to update an existing row in the spread sheet
  const onRowEdit = (index) => {
    setActiveIndex(index)
    setInsertRow(false)
    setShowForm(true)
  }

  // Move a row up one row in the spreadsheet
  const onRowMoveUp = (index) => moveRowInSpreadSheet(index, true)

  // Move a row down one row in the spreadsheet
  const onRowMoveDown = (index) => moveRowInSpreadSheet(index, false)

  // Delete a row from the spreadsheet.
  const onRowDelete = (index) => {
    setActiveIndex(index)
    setRowToDeleteName(rows[index][0])
    openDeleteConfirmDialog()
  }

  return (
    <>
      <Space between>
        <Space>
          <Heading>
            Google Spreadsheet: <Code>{spreadsheetId}</Code>
          </Heading>
        </Space>
        <Tooltip content="Create a new spreadsheet using the contents of a sample spreadsheet provided by google.">
          <ButtonOutline onClick={recreateFromSource}>
            Recreate sheet from source
          </ButtonOutline>
        </Tooltip>
      </Space>
      <SheetsTable
        rows={rows}
        onRowMoveUp={onRowMoveUp}
        onRowMoveDown={onRowMoveDown}
        onRowInsert={onRowInsert}
        onRowEdit={onRowEdit}
        onRowDelete={onRowDelete}
      />
      {deleteConfirmDialog}
      <SheetsForm
        showForm={showForm}
        setShowForm={setShowForm}
        index={activeIndex}
        row={insertRow ? ['', '', '', '', '', ''] : rows[activeIndex]}
        isInsert={insertRow}
        onRowSave={insertRow ? insertRowInSpreadSheet : updateRowInSpreadSheet}
        rows={rows}
      />
    </>
  )
}

Sheets.propTypes = {
  clearMessage: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  updateMessage: PropTypes.func.isRequired,
}
