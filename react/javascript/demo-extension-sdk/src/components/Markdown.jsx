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
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { Heading, Paragraph } from '@looker/components'

const MarkdownWrapper = styled.div`
  & > ul {
    margin-bottom: 10px;
    list-style: disc inside;
  }
  & > ol {
    margin-bottom: 10px;
    list-style: decimal inside;
  }
`

export const Markdown = ({ markdown }) => {
  const heading = ({ level, children }) => (
    <Heading as={`h${level}`}>{children}</Heading>
  )

  const paragraph = ({ children }) => (
    <Paragraph pb="medium">{children}</Paragraph>
  )

  const components = {
    h1: heading,
    h2: heading,
    h3: heading,
    h4: heading,
    h5: heading,
    h6: heading,
    p: paragraph,
  }

  return (
    <MarkdownWrapper>
      <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
    </MarkdownWrapper>
  )
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
}
