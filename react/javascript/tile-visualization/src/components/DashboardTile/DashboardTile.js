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
import React, { useContext, useCallback, useEffect, useState } from 'react'
import { SpaceVertical, Heading, MessageBar } from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { DashboardRunState } from '@looker/extension-sdk'
import { LiquidFillGaugeViz } from '../LiquidFillGaugeViz/LiquidFillGaugeViz'

const findTheLookModel = async (coreSDK) => {
  try {
    const models = await coreSDK.ok(
      coreSDK.all_lookml_models({ fields: 'name' })
    )
    if (models.find((model) => model.name === 'cypress_thelook')) {
      return { modelName: 'cypress_thelook' }
    }
    if (models.find((model) => model.name === 'thelook')) {
      return { modelName: 'thelook' }
    }
    return {
      error: 'No thelook model was found. Using a random value.',
    }
  } catch (error) {
    console.error(error)
    return {
      error:
        "An error occurred while reading the system's LookML models. Using a random value.",
    }
  }
}

const runInlineQuery = async (coreSDK, modelName) => {
  try {
    const response = await coreSDK.ok(
      coreSDK.run_inline_query({
        body: {
          fields: ['users.count_percent_of_total', 'users.state'],
          sorts: ['users.count_percent_of_total desc 0'],
          filters: { 'users.country': 'US' },
          model: modelName,
          total: false,
          view: 'users',
          limit: 500,
        },
        result_format: 'json',
      })
    )
    if (
      response.length > 0 &&
      typeof response[0]['users.count_percent_of_total'] === 'number'
    ) {
      return { value: response[0]['users.count_percent_of_total'] }
    }
    return {
      error: 'Inline query did not return a valid value. Using a random value.',
    }
  } catch (error) {
    console.error(error)
    return {
      error:
        'An error occurred running the inline query. Using a random value.',
    }
  }
}

/**
 * This component demonstrates a dashboard tile that is reponsible for
 * getting its own data. Note the technique for determining whether
 * the user has clicked the dashboard reload button. It is not
 * guaranteed that dashboardRunState from tileHostData will ever
 * indicate that the dashboard is running. This is due to performance
 * techniques used by the dashboard and happens when the dashboard does
 * not contain any tiles that run queries. A guaranteed technique to
 * determine if the dashboard reload button has been clicked is to save
 * the lastRunStartTime value from the tileHostData. If this value changes
 * then the user has clicked the dashboard run button (or the dashboard
 * has been setup to auto refresh).
 */
export const DashboardTile = ({ standalone, config }) => {
  const { extensionSDK, coreSDK, tileHostData } = useContext(ExtensionContext40)
  const { lastRunStartTime, dashboardRunState } = tileHostData || -1
  const [saveLastRunStartTime, setSaveLastRunStartTime] = useState()
  const [value, setValue] = useState()
  const [runningInLineQuery, setRunningInLineQuery] = useState(false)
  const [message, setMessage] = useState()
  // Standalone extensions do not have height set on the html
  // and body tags. When running standalonethis component calculates
  // the height using vh value.
  const height = standalone ? 'calc(100vh - 100px)' : '100%'

  useEffect(() => {
    const readData = async () => {
      setSaveLastRunStartTime(lastRunStartTime)
      if (!runningInLineQuery) {
        setRunningInLineQuery(true)
        setValue(undefined)
        let result = await findTheLookModel(coreSDK)
        if (result.modelName) {
          result = await runInlineQuery(coreSDK, result.modelName)
        }
        if (!result.value) {
          result.value = Math.floor(Math.random() * 100)
        }
        setMessage(result.error)
        setValue(result.value)
        setRunningInLineQuery(false)
      }
    }
    if (
      !saveLastRunStartTime ||
      lastRunStartTime !== saveLastRunStartTime ||
      // Not required but shown here as an alternative
      dashboardRunState === DashboardRunState.RUNNING
    ) {
      readData()
    }
  }, [
    lastRunStartTime,
    saveLastRunStartTime,
    setSaveLastRunStartTime,
    dashboardRunState,
  ])

  const renderComplete = useCallback(() => {
    extensionSDK.rendered()
  }, [])

  // Note the height of 100% on space vertical. All of the divs that are
  // parents of the visualization need to be given a height of 100%
  // in order for the visualization to utilize for full size of the
  // IFRAME content window,
  return (
    <SpaceVertical p="xxxxxlarge" width="100%" align="center" height={height}>
      <Heading as="h1">Dashboard Tile</Heading>
      {message && <MessageBar intent="critical">{message}</MessageBar>}
      {value && (
        <LiquidFillGaugeViz
          width="100%"
          height="100%"
          value={value}
          renderComplete={renderComplete}
          valueFormat={null}
          config={config}
        />
      )}
    </SpaceVertical>
  )
}
