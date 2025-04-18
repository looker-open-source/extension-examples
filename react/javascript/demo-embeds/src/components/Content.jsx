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
import { Accordion2, SpaceVertical, MessageBar } from '@looker/components'
import {
  useAllDashboards,
  useAllExplores,
  useAllLooks,
  useSearchReports,
} from '../hooks'
import { ContentList } from './ContentList'

export const Content = ({
  onSelected,
  selectedId,
  selectedContentType,
  running,
  onLoadError,
}) => {
  const dashboardData = useAllDashboards()
  const exploreData = useAllExplores()
  const lookData = useAllLooks()
  const reportsData = useSearchReports()

  useEffect(() => {
    if (dashboardData.error) {
      onLoadError('An error occurred loading Dashboard data.')
    }
  }, [dashboardData, onLoadError])

  useEffect(() => {
    if (exploreData.error) {
      onLoadError('An error occurred loading Explore data.')
    }
  }, [exploreData, onLoadError])

  useEffect(() => {
    if (lookData.error) {
      onLoadError('An error occurred loading Look data.')
    }
  }, [lookData, onLoadError])

  return (
    <SpaceVertical>
      <Accordion2 label="Dashboards" defaultOpen>
        {dashboardData.error && (
          <MessageBar intent="critical">Load Error</MessageBar>
        )}
        <ContentList
          contentType="dashboards"
          selectedContentType={selectedContentType}
          selectedId={selectedId}
          onSelected={onSelected}
          content={dashboardData.data}
          running={running}
        />
      </Accordion2>
      <Accordion2 label="Looks">
        {dashboardData.error && (
          <MessageBar intent="critical">Load Error</MessageBar>
        )}
        <ContentList
          contentType="looks"
          selectedContentType={selectedContentType}
          selectedId={selectedId}
          onSelected={onSelected}
          content={lookData.data}
          running={running}
        />
      </Accordion2>
      <Accordion2 label="Explores">
        {dashboardData.error && (
          <MessageBar intent="critical">Load Error</MessageBar>
        )}
        <ContentList
          contentType="explore"
          selectedContentType={selectedContentType}
          selectedId={selectedId}
          onSelected={onSelected}
          content={exploreData.data}
          running={running}
        />
      </Accordion2>
      <Accordion2 label="Reports">
        <ContentList
          contentType="reporting"
          selectedContentType={selectedContentType}
          selectedId={selectedId}
          onSelected={onSelected}
          content={reportsData.data}
          running={running}
        />
      </Accordion2>
    </SpaceVertical>
  )
}
