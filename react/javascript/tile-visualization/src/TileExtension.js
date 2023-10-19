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
import React, { useContext } from 'react'
import styled from 'styled-components'
import { ComponentsProvider } from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { MountPoint } from '@looker/extension-sdk'
import { VisualizationTile } from './components/VisualizationTile/VisualizationTile'
import { DashboardTile } from './components/DashboardTile/DashboardTile'

const getDefaultRouteComponent = (mountPoint) => {
  if (mountPoint === MountPoint.dashboardVisualization) {
    return <VisualizationTile />
  }
  if (mountPoint === MountPoint.dashboardTile) {
    return <DashboardTile />
  }
  // Standalone extensions do not get the additional CSS
  // that ensures the html and body tags occupy 100% of the
  // IFRAME content window. In standalone mode Dashboard tile
  // uses vh to calculate its height.
  return <DashboardTile standalone={true} />
}

export const TileExtension = () => {
  const { lookerHostData } = useContext(ExtensionContext40)

  return (
    <ComponentsProviderWrapper>
      <ComponentsProvider>
        {getDefaultRouteComponent(lookerHostData?.mountPoint)}
      </ComponentsProvider>
    </ComponentsProviderWrapper>
  )
}

// ComponentsProvider generates an additional div that does not
// have a height of 100%. This wrapper component ensures that it
// gets the correct height so that a height of 100% is propageted
// down to the visualization.
const ComponentsProviderWrapper = styled.div`
  height: 100%;
  & > div {
    height: 100%;
  }
`
