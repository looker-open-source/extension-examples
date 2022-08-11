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
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { mockSDK } from '@looker/visualizations'
import { VisualizationComponents } from './VisualizationComponents'
import { renderWithExtensionContext } from './__mocks__/render_with_extension'

const queryMethodListener = jest.fn()

describe('VisualizationComponents', () => {
  // TODO activate again. Failing with Component must be wrapped with <Container.Provider>
  // error
  it.skip('User can enter a Query ID or Slug', async () => {
    renderWithExtensionContext(
      <VisualizationComponents />,
      {},
      {
        core40SDK: {
          ...mockSDK,
          query: (id: string) =>
            mockSDK.query(id).then((result) => {
              queryMethodListener(id)
              return result
            }),
        },
      }
    )

    fireEvent.change(screen.getByLabelText('Query (Numeric ID or Slug)'), {
      target: { value: '12345' },
    })

    await waitFor(() => {
      expect(queryMethodListener).toHaveBeenLastCalledWith('12345')
    })
  })
})
