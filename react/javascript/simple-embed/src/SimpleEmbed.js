/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { ComponentsProvider, Flex, InputText, Label, Select, Space, Text, Tooltip } from '@looker/components'
import { ChartBar, DashboardFile, Explore } from '@looker/icons'
import React, { useState } from 'react'
import Embed from './components/Embed'

const SimpleEmbed = () => {
  const [content_id, setContentId] = useState('1');
  const [content_type, setContentType] = useState('dashboard');

  return (
    <>
      <ComponentsProvider>
        <Flex flexDirection="column" backgroundColor="rgb(246, 248, 250)">
          <Flex 
            height="50px" 
            justifyContent="space-between"
            p="xsmall"
          >
            <Flex alignItems="center" justifyContent="center">
              <Space>
                <img 
                  height="35px"
                  src="https://looker.com/favicon.ico" 
                />
                <Text>Looker Extension Framework: Simple Embed</Text>
              </Space>
            </Flex>
            <Flex alignItems="center" justifyContent="center">
              <Space>
                <Label>Content Type</Label>
                <Select
                  options={[
                    { icon: <DashboardFile />, value: 'dashboard', label: 'Dashboard' },
                    { icon: <ChartBar />,value: 'look', label: 'Look' },
                    { icon: <Explore />,value: 'explore', label: 'Explore' },
                  ]}
                  label="Content Type"
                  value={content_type}
                  onChange={setContentType}
                />
                <Tooltip 
                  content={(content_type==='explore')?"Input the explore ID like you see in an explore URL (e.g., model_name/explore_name )": `Input the ${content_type} ID`}
                >
                  <Label>ID ⓘ</Label>
                </Tooltip>
                <InputText 
                  value={content_id} 
                  onChange={(e)=>setContentId(e.target.value)}
                />
              </Space>
            </Flex>
          </Flex>
          <Embed type={content_type} id={content_id} />
        </Flex>
      </ComponentsProvider>
    </>
  )
}

export default SimpleEmbed;