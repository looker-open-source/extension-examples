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
import { screen } from '@testing-library/react'
import { renderWithExtensionContext40 } from './__mocks__/render_with_extension'
import { AccessKeyDemo } from './AccessKeyDemo'

describe('AccessKeyDemo', () => {
  test('it renders', async () => {
    const userAttributeGetItem = jest.fn().mockImplementation(() => 'yes')
    const serverProxy = jest
      .fn()
      .mockImplementation(() => ({ ok: true, body: { jwt_token: '1234' } }))
    const createSecretKeyTag = jest
      .fn()
      .mockImplementation((tag: string) => `__${tag}__`)
    const ok = (result: any) => result
    const me = () => ({
      display_name: "Rosie O'Grady",
      email: 'rosie@ogrady.org',
      can: {
        index_details: true,
        show_details: true,
      },
    })
    renderWithExtensionContext40(
      <AccessKeyDemo
        updateCriticalMessage={jest.fn()}
        updatePositiveMessage={jest.fn()}
        clearMessage={jest.fn()}
      />,
      { userAttributeGetItem, serverProxy, createSecretKeyTag },
      { coreSDK: { me, ok } }
    )
    await screen.findByText('Verify JWT token')
    await screen.findByText('Configure')
    expect(userAttributeGetItem).toHaveBeenCalled()
    expect(createSecretKeyTag).toHaveBeenCalled()
    expect(serverProxy).toHaveBeenCalled()
  })
})
