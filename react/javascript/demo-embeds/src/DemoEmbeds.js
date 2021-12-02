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

import React, { useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import {
  ComponentsProvider,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  useTabs,
} from '@looker/components'
import styled from 'styled-components'
import { useCurrentRoute, useNavigate } from './hooks'
import { DashboardEmbedNext } from './components/DashboardEmbedNext'
import { DashboardEmbed } from './components/DashboardEmbed'
import { ExploresEmbed } from './components/ExploresEmbed'
import { LooksEmbed } from './components/LooksEmbed'

const tabNames = ['dashboards', 'dashboards-legacy', 'looks', 'explores']

export const DemoEmbeds = () => {
  const [linkParam, setLinkParam] = useState()
  const { search, pathname } = useLocation()
  const history = useHistory()
  const { embedType } = useCurrentRoute()
  const { updateEmbedType } = useNavigate(embedType)
  const tabs = useTabs({
    onChange: (index) => {
      if (tabNames[index] !== embedType) {
        updateEmbedType(tabNames[index])
      }
    },
  })
  const { onSelectTab, selectedIndex } = tabs

  useEffect(() => {
    if (search) {
      // Spartan demo code.
      // Handle a link sent from a embed to a spartan user.
      // The link is crafted to go the spartan users home page
      // with the link to re-instantiate the embed as the link
      // parameter. The extension is reponsible for mapping the
      // Looker UI formatted URL to the extensions URL. This
      // mapping occurs in the useEffect following.
      const searchParams = new URLSearchParams(search)
      const link = searchParams.get('link')
      if (link !== linkParam) {
        setLinkParam(link)
      }
    } else {
      setLinkParam(undefined)
    }
  }, [search])

  useEffect(() => {
    if (linkParam) {
      // Spartan demo code.
      // Handle a link sent from a dashboard to a spartan user.
      // The following maps the Looker URL to the extension URL.
      try {
        const link = decodeURIComponent(linkParam)
        const linkParts = link.split('/')
        console.log({ link, linkParts })
        if (linkParts[1] === 'dashboards') {
          history.replace(`/dashboards//${linkParts[2].split('?')[0]}`)
        } else if (linkParts[1] === 'explore') {
          console.log({ linkParts })
          history.replace(
            `/explores//${linkParts[2]}::${linkParts[3].split('?')[0]}`
          )
        } else if (linkParts[1] === 'looks') {
          history.replace(`/looks//${linkParts[2].split('?')[0]}`)
        } else {
          history.replace(pathname)
        }
      } catch (err) {
        // Very simplistic error handling for demo purposes.
        console.error(err)
        history.replace(pathname)
      }
    }
  }, [linkParam])

  useEffect(() => {
    if (embedType) {
      const routeTabIndex = tabNames.indexOf(embedType)
      if (routeTabIndex > -1 && embedType !== tabNames[selectedIndex]) {
        onSelectTab(routeTabIndex)
      }
    }
  }, [embedType])

  if (linkParam) {
    return <></>
  }

  return (
    <ComponentsProvider>
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
            <DashboardEmbed embedType={tabNames[1]} />
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
