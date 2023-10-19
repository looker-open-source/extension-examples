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

import { defaultConfig } from './liquid_fill_gauge'

export const getValueAndFormat = (visualizationSDK) => {
  // TODO add error checking
  const visConfig = {
    ...defaultConfig,
    ...visualizationSDK.visConfig,
  }

  const queryResponse = visualizationSDK.queryResponse
  const { data } = queryResponse

  const datumField = queryResponse.fieldMeasureLike[0]
  if (!datumField) {
    return { value: undefined, valueFormat: undefined }
  }
  const valueFormat = visConfig.displayPercent ? null : datumField.value_format
  const datum = data[0][datumField.name]
  let value = datum.value

  const compareField = queryResponse.fieldMeasureLike[1]
  if (compareField && visConfig.showComparison) {
    const compareDatum = data[0][compareField.name]
    visConfig.maxValue = compareDatum.value
  }

  if (visConfig.displayPercent) {
    value = (datum.value / visConfig.maxValue) * 100
    visConfig.maxValue = 100
  }

  return { value, valueFormat }
}

export const liquidFillDefaultConfig = {
  circleColor: {
    default: defaultConfig.circleColor,
    display: 'color',
    label: 'Circle Color',
    section: 'Style',
    type: 'string',
  },
  circleFillGap: {
    default: defaultConfig.circleFillGap,
    label: 'Circle Gap',
    max: 1,
    display: 'range',
    min: 0,
    section: 'Style',
    step: 0.05,
    type: 'number',
  },
  circleThickness: {
    default: defaultConfig.circleThickness,
    label: 'Circle Thickness',
    max: 1,
    display: 'range',
    min: 0,
    section: 'Style',
    step: 0.05,
    type: 'number',
  },
  maxValue: {
    default: defaultConfig.maxValue,
    label: 'Max value',
    min: 0,
    placeholder: 'Any positive number',
    section: 'Value',
    type: 'number',
  },
  minValue: {
    default: defaultConfig.minValue,
    label: 'Min value',
    min: 0,
    placeholder: 'Any positive number',
    section: 'Value',
    type: 'number',
  },
  showComparison: {
    default: false,
    label: 'Use field comparison',
    section: 'Value',
    type: 'boolean',
  },
  textVertPosition: {
    label: 'Text Vertical Offset',
    max: 1,
    min: 0,
    default: 0.5,
    step: 0.01,
    section: 'Value',
    display: 'range',
    type: 'number',
  },
  textSize: {
    label: 'Text Size',
    max: 1,
    min: 0,
    default: 1,
    step: 0.01,
    section: 'Value',
    display: 'range',
    type: 'number',
  },
  waveAnimate: {
    default: true,
    label: 'Animate Waves',
    section: 'Waves',
    type: 'boolean',
  },
  displayPercent: {
    default: true,
    label: 'Display as Percent',
    section: 'Value',
    type: 'boolean',
  },
  waveAnimateTime: {
    label: 'Wave Animation Time',
    default: defaultConfig.waveAnimateTime,
    max: 5000,
    min: 1,
    section: 'Waves',
    display: 'range',
    step: 50,
    type: 'number',
  },
  textColor: {
    default: '#000000',
    label: 'Text Color (non-overlapped)',
    display: 'color',
    section: 'Style',
    type: 'string',
  },
  waveCount: {
    label: 'Wave Count',
    default: defaultConfig.waveCount,
    max: 10,
    display: 'range',
    min: 0,
    section: 'Waves',
    type: 'number',
  },
  valueCountUp: {
    default: true,
    label: 'Animate to Value',
    section: 'Waves',
    type: 'boolean',
  },
  waveHeight: {
    label: 'Wave Height',
    max: 1,
    default: defaultConfig.waveHeight,
    min: 0,
    section: 'Waves',
    step: 0.05,
    display: 'range',
    type: 'number',
  },
  waveColor: {
    default: '#64518A',
    label: 'Wave Color',
    display: 'color',
    section: 'Style',
    type: 'string',
  },
  waveHeightScaling: {
    default: defaultConfig.waveHeightScaling,
    label: 'Scale waves if high or low',
    section: 'Waves',
    type: 'boolean',
  },
  waveOffset: {
    label: 'Wave Offset',
    default: 0,
    max: 1,
    min: 0,
    section: 'Waves',
    display: 'range',
    step: 0.05,
    type: 'number',
  },
  waveRiseTime: {
    label: 'Wave Rise Time',
    min: 0,
    max: 5000,
    step: 50,
    default: defaultConfig.waveRiseTime,
    section: 'Waves',
    type: 'number',
    display: 'range',
  },
  waveRise: {
    default: defaultConfig.waveRise,
    label: 'Wave Rise from Bottom',
    section: 'Waves',
    type: 'boolean',
  },
  waveTextColor: {
    default: '#FFFFFF',
    display: 'color',
    label: 'Text Color (overlapped)',
    section: 'Style',
    type: 'string',
  },
}
