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
import React, { useEffect, useRef } from 'react'
import { Span } from '@looker/components'
import { useWindowSize } from '../../hooks/use_window_size'
import {
  createSvg,
  liquidFillGauge,
  defaultConfig,
} from './liquid_fill_gauge.js'

export const LiquidFillGaugeViz = ({
  renderComplete,
  value,
  valueFormat,
  config,
  height,
  width,
}) => {
  const ctrRef = useRef(null)
  // changes to the IFRAME height or width will trigger a rerender.
  // this will happen if the parent window is resized or the containing
  // tile is edited to a new size.
  const { height: windowHeight, width: windowWidth } = useWindowSize()

  useEffect(() => {
    if (ctrRef.current) {
      const element = ctrRef.current
      const svg = createSvg(element)
      const cfg = { ...defaultConfig, ...(config || {}) }
      liquidFillGauge(svg, value, cfg, valueFormat)
      if (renderComplete) {
        renderComplete()
      }
    }
  }, [value, valueFormat, config, windowHeight, windowWidth])

  return <Span style={{ height, width }} ref={ctrRef}></Span>
}
