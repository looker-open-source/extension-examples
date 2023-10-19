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
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'

window.addEventListener('DOMContentLoaded', (_) => {
  const root = document.createElement('div')
  // Tile extensions get additional css that ensures that
  // the html and body tag heights are set to 100% of the actual
  // IFRAME content window.
  // In order for the visualization to take advantage of this
  // and occupy the height without calculations or estimates,
  // the height of the container div is set to 100%. This must
  // be propagated down to the actual visualization.
  root.style.height = '100%'
  root.style.width = 'calc(100% - 0px)'
  document.body.appendChild(root)
  ReactDOM.render(<App />, root)
})
