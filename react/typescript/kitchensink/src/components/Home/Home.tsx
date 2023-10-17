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
import { Heading, Paragraph, SpaceVertical } from '@looker/components'
import { SandboxStatus } from '../SandboxStatus'
import type { HomeProps } from './types'

const Home: React.FC<HomeProps> = () => {
  return (
    <>
      <Heading mt="xlarge">Home</Heading>
      <SandboxStatus />
      <SpaceVertical>
        <Paragraph>
          Welcome to the kitchen sink which demonstrates how to exercise the
          capabilities of the extension framework.
        </Paragraph>
        <Paragraph>
          The <b>Api Functions view</b> demonstrates the basic capabilties of
          the extension framework, for example navigation and local storage
          access.
        </Paragraph>
        <Paragraph>
          The <b>Core Functions view</b> demonstrates using the Looker SDK.
        </Paragraph>
        <Paragraph>
          The <b>Embed Dashboard view</b> demonstrates using the embed SDK to
          display an embedded dashboard in an extension.
        </Paragraph>
        <Paragraph>
          The <b>Embed Explore view</b> demonstrates using the embed SDK to
          display an embedded explore in an extension.
        </Paragraph>
        <Paragraph>
          The <b>Embed Look view</b> demonstrates using the embed SDK to display
          an embedded look in an extension.
        </Paragraph>
        <Paragraph>
          The <b>External Api Functions view</b> demonstrates various ways to
          access external APIs from an extension. It also demonstrates how to
          integrate with OAUTH2 providers. Note that a data server is required
          to exercise this functionality. Running{' '}
          <code>npm run start-data-server</code> from your work space starts the
          data server.
        </Paragraph>
        <Paragraph>
          The <b>Miscellaneous view</b> demonstrates unclassifiable
          functionality of the extension framework. An example is how the
          framework handles an attempt to navigate away from the initial
          extension page (it reloads the extension). It also shows a specialized
          logout button for <b>Spartan</b> extensions (extensions that run
          without the Looker chrome).
        </Paragraph>
        <Paragraph>
          The <b>Configuration view</b> demonstrates how to use the extension
          context API to save configuration data. Basically views can be hidden
          or shown. Default artifact ids can be overridden for embedded views.
        </Paragraph>
      </SpaceVertical>
    </>
  )
}

export default Home
