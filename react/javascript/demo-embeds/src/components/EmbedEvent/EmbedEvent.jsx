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
import { Tree, TreeItem } from '@looker/components'

export const EmbedEvent = ({ embedEvent }) => {
  const buildTree = (obj) => {
    return Object.keys(obj).map((key) => {
      const varType = typeof obj[key]
      if (
        varType === 'string' ||
        varType === 'number' ||
        varType === 'number' ||
        !obj[key]
      ) {
        return (
          <TreeItem truncate={true} key={key}>
            {key + ' : ' + obj[key]}
          </TreeItem>
        )
      } else if (varType === 'object') {
        return (
          <Tree label={key} density={-3} key={key}>
            {buildTree(obj[key])}
          </Tree>
        )
      }
      return undefined
    })
  }

  const { type, ...rest } = embedEvent
  return (
    <Tree label={type} density={-3}>
      {buildTree(rest)}
    </Tree>
  )
}

EmbedEvent.propTypes = {
  embedEvent: PropTypes.object,
}
