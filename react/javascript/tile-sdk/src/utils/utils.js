/*

 MIT License

 Copyright (c) 2023 Looker Data Sciences, Inc.

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

// TODO move these methods into the extension SDK

/**
 * Get drill links for a row and a column. Column can be a numeric
 * index OR the name of the column.
 */
export const getDrillLinks = (data, row, column) => {
  let links = []
  if (data && data.length && row < data.length) {
    const selectedRow = data[row]
    const columnKeys = Array.from(Object.keys(selectedRow))
    let selectedColumnKey
    if (typeof column === 'number') {
      selectedColumnKey = columnKeys[column]
    } else if (columnKeys.includes(column)) {
      selectedColumnKey = column
    }
    if (selectedColumnKey) {
      const selectedColumn = selectedRow[selectedColumnKey]
      if (selectedColumn?.links?.length && selectedColumn?.links?.length > 0) {
        links = [...selectedColumn.links]
      }
    }
  }
  return links
}

export const CrossfilterSelection = Object.seal({
  NONE: 0,
  SELECTED: 1,
  UNSELECTED: 2,
})

/**
 * Checks if crossfilters are selected for a Row + Pivot
 * by inspecting the crossfilterSelection property of the cells
 * Will return true if every cell is selected (ignoring undefined selections)
 * Call only when crossfilters are present in the element
 */
export const getCrossfilterSelection = (row, pivot) => {
  // get row crossfilterSelection values
  const rowCells = Object.values(row || {}).map(
    (item) => item.crossfilterSelection
  )
  // get pivot crossfilterSelection values
  const pivotCells = Object.values(pivot?.metadata || {}).map(
    (item) => item.crossfilterSelection
  )
  // merge both lists and remove undefined values
  const cells = [...rowCells, ...pivotCells].filter((value) => !!value)

  // if there are non undefined any selection values
  if (cells.length) {
    // if every cell is selected
    return cells.every((value) => value === CrossfilterSelection.SELECTED)
      ? // return selected
        CrossfilterSelection.SELECTED
      : // if at least one is unselected, return unselected
        CrossfilterSelection.UNSELECTED
  }

  // if all cells are undefined, return none
  return CrossfilterSelection.NONE
}
