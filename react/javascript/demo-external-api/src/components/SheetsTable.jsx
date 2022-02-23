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

import React from 'react'
import PropTypes from 'prop-types'
import {
  DataTable,
  DataTableAction,
  DataTableItem,
  DataTableCell,
} from '@looker/components'

/**
 * Renders rows from the sheet.
 */
export const SheetsTable = ({
  rows,
  onRowMoveUp,
  onRowMoveDown,
  onRowInsert,
  onRowEdit,
  onRowDelete,
}) => {
  const sheetColumns = [
    {
      id: 'name',
      size: 'medium',
      title: 'Name',
      type: 'string',
    },
    {
      id: 'gender',
      size: 'medium',
      title: 'Gender',
      type: 'string',
    },
    {
      id: 'collegeYear',
      size: 'medium',
      title: 'Year',
      type: 'string',
    },
    {
      id: 'state',
      size: 'medium',
      title: 'State',
      type: 'string',
    },
    {
      id: 'major',
      size: 'medium',
      title: 'Major',
      type: 'string',
    },
    {
      id: 'activity',
      size: 'medium',
      title: 'Activity',
      type: 'string',
    },
  ]

  const rowItems = rows.map((row, index) => {
    const actions = (
      <>
        <DataTableAction onClick={onRowInsert.bind(null, index)}>
          Insert
        </DataTableAction>
        <DataTableAction onClick={onRowEdit.bind(null, index)}>
          Edit
        </DataTableAction>
        <DataTableAction
          onClick={onRowMoveUp.bind(null, index)}
          disabled={index === 0}
        >
          Move up
        </DataTableAction>
        <DataTableAction
          onClick={onRowMoveDown.bind(null, index)}
          disabled={index === rows.length - 1}
        >
          Move down
        </DataTableAction>
        <DataTableAction onClick={onRowDelete.bind(null, index)}>
          Delete
        </DataTableAction>
      </>
    )
    const [name, gender, collegeYear, state, major, activity] = row
    return (
      <DataTableItem key={name} id={name} actions={actions}>
        <DataTableCell>{name}</DataTableCell>
        <DataTableCell>{gender}</DataTableCell>
        <DataTableCell>{collegeYear}</DataTableCell>
        <DataTableCell>{state}</DataTableCell>
        <DataTableCell>{major}</DataTableCell>
        <DataTableCell>{activity}</DataTableCell>
      </DataTableItem>
    )
  })

  return (
    <DataTable columns={sheetColumns} caption="Spread sheet data">
      {rowItems}
    </DataTable>
  )
}

SheetsTable.propTypes = {
  onRowDelete: PropTypes.func.isRequired,
  onRowEdit: PropTypes.func.isRequired,
  onRowInsert: PropTypes.func.isRequired,
  onRowMoveDown: PropTypes.func.isRequired,
  onRowMoveUp: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
}
