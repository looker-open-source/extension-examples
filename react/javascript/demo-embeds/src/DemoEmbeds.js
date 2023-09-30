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

import React, { useEffect } from 'react'
import {
  ComponentsProvider,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  useTabs,
} from '@looker/components'
import styled from 'styled-components'
import { useCurrentRoute, useNavigate, useTargetResource } from './hooks'
import { DashboardEmbedNext } from './components/DashboardEmbedNext'
import { DashboardEmbedLegacy } from './components/DashboardEmbedLegacy'
import { ExploresEmbed } from './components/ExploresEmbed'
import { LooksEmbed } from './components/LooksEmbed'

const tabNames = ['dashboards', 'dashboards-legacy', 'looks', 'explores']

export const DemoEmbeds = () => {
  const { embedType } = useCurrentRoute()
  const { updateEmbedType } = useNavigate(embedType)
  const hasTargetResource = useTargetResource()
  const tabs = useTabs({
    onChange: (index) => {
      if (tabNames[index] !== embedType) {
        updateEmbedType(tabNames[index])
      }
    },
  })
  const { onSelectTab, selectedIndex } = tabs

  useEffect(() => {
    if (embedType) {
      const routeTabIndex = tabNames.indexOf(embedType)
      if (routeTabIndex > -1 && embedType !== tabNames[selectedIndex]) {
        onSelectTab(routeTabIndex)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedType])

  if (hasTargetResource) {
    return <></>
  }

  return (
    <ComponentsProvider
      themeCustomizations={{
        colors: { key: '#1A73E8' },
      }}
    >
      <View>
        <TabList {...tabs}>
          <Tab>Dashboards Next</Tab>
          <Tab>Dashboards Legacy</Tab>
          <Tab>Looks</Tab>
          <Tab>Explores</Tab>
        </TabList>
        <TabPanels {...tabs} pt="0">
          <TabPanel>
            <DashboardEmbedNext embedType={tabNames[0]} />
          </TabPanel>
          <TabPanel>
            <DashboardEmbedLegacy embedType={tabNames[1]} />
          </TabPanel>
          <TabPanel>
            <LooksEmbed embedType={tabNames[2]} />
          </TabPanel>
          <TabPanel>
            <ExploresEmbed embedType={tabNames[3]} />
          </TabPanel>
        </TabPanels>
      </View>
    </ComponentsProvider>
  )
}

const View = styled.div`
  width: 100%;
  height: calc(100vh - 50px);
`
