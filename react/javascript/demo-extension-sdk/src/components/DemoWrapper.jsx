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

import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Accordion,
  AccordionDisclosure,
  AccordionContent,
  Card,
  CardContent,
  CodeBlock,
  Heading,
  Link,
  SpaceVertical,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { Markdown } from '.'

const baseUrl =
  'https://github.com/looker-open-source/extension-examples/tree/main/react/javascript/demo-extension-sdk/src/demos/'

export const DemoWrapper = ({
  title,
  description,
  code,
  codeSourceName,
  children,
}) => {
  const { extensionSDK } = useContext(ExtensionContext40)
  const [codeShowing, setCodeShowing] = useState(false)

  const showCodeInGithub = () => {
    extensionSDK.openBrowserWindow(`${baseUrl}${codeSourceName}`)
  }

  return (
    <Card raised width="100%">
      <CardContent>
        <Heading pb="medium">{title}</Heading>
        <Markdown markdown={description}></Markdown>
        <SpaceVertical py="medium">{children}</SpaceVertical>
        <Accordion isOpen={codeShowing} toggleOpen={setCodeShowing}>
          <AccordionDisclosure>
            {codeShowing ? 'Hide code' : 'Show code'}
          </AccordionDisclosure>
          <AccordionContent>
            <CodeBlock>{code}</CodeBlock>
            <Link onClick={showCodeInGithub}>Show code in github</Link>
          </AccordionContent>
        </Accordion>
      </CardContent>
    </Card>
  )
}

DemoWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  code: PropTypes.string.isRequired,
  codeSourceName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
