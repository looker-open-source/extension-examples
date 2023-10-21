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
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { renderWithExtensionContext40 } from './__mocks__/render_with_extension'
import { TileSdkExtension } from './TileSdkExtension'

describe('TileSdkExtension', () => {
  test('it renders', async () => {
    const ok = (result) => result
    renderWithExtensionContext40(<TileSdkExtension />, {}, { coreSDK: { ok } })
    expect(screen.getByText('Tile host data')).toBeInTheDocument()
    expect(
      screen.getByText('Dashboard id is "42". Element id is "84".')
    ).toBeInTheDocument()
  })
})
