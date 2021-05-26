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

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonOutline,
  Heading,
  Code,
  Space,
  Tooltip,
  useConfirm,
} from '@looker/components'
import { useGoogleSheets } from '../../hooks'
import { SheetsTable } from './SheetsTable'
import { SheetsForm } from './SheetsForm'

/**
 * Main sheets component.
 */
export const Sheets = ({ signOut, token, updateMessage, clearMessage }) => {
  const {
    init,
    load,
    remove,
    move,
    update,
    insert,
    spreadsheetId,
    rows,
    error,
    expired,
  } = useGoogleSheets(token)
  const [rowToDeleteName, setRowToDeleteName] = useState()
  const [activeIndex, setActiveIndex] = useState()
  const [insertRow, setInsertRow] = useState()
  const [showForm, setShowForm] = useState()

  useEffect(() => {
    load()
  }, [token])

  const [deleteConfirmDialog, openDeleteConfirmDialog] = useConfirm({
    confirm: 'Yes, delete row from sheet',
    buttonColor: 'critical',
    title: 'Delete row from sheet',
    message: `Are you sure you want to delete the row with name ${rowToDeleteName} from the sheet?`,
    onConfirm: (close) => {
      remove(activeIndex)
      close()
    },
    onCancel: (close) => {
      close()
    },
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
  const onRowMoveUp = (index) => move(index, true)

  // Move a row down one row in the spreadsheet
  const onRowMoveDown = (index) => move(index, false)

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
          <ButtonOutline onClick={init}>
            Initialize sheet from source
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
        onRowSave={insertRow ? insert : update}
        rows={rows}
      />
    </>
  )
}

Sheets.propTypes = {
  token: PropTypes.string.isRequired,
  signOut: PropTypes.func.isRequired,
  updateMessage: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
}
