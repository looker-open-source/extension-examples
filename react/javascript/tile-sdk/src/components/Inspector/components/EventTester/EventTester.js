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
import React, {
  useCallback,
  useContext,
  useState,
  useRef,
  useMemo,
} from 'react'
import {
  Space,
  Accordion2,
  Card,
  CardContent,
  Grid,
  ButtonOutline,
  FieldToggleSwitch,
  Paragraph,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import {
  getDrillLinks,
  getCrossfilterSelection,
  CrossfilterSelection,
} from '../../../../utils/utils'

export const EventTester = () => {
  const {
    extensionSDK,
    tileSDK,
    tileHostData: {
      dashboardFilters,
      isExploring,
      isDashboardEditing,
      isDashboardCrossFilteringEnabled,
    },
    visualizationData,
    visualizationSDK,
  } = useContext(ExtensionContext40)
  const [runDashboard, setRunDashboard] = useState(false)
  const openDrillMenuButtonRef = useRef()
  const toggleCrossFilterButtonRef = useRef()

  const currentCrossFiltersSelection = useMemo(() => {
    if (isDashboardCrossFilteringEnabled && visualizationSDK) {
      const queryResponse = visualizationSDK.queryResponse
      if (queryResponse) {
        let row
        let pivot
        if (queryResponse?.data.length > 0) {
          row = queryResponse?.data[0]
        }
        if (queryResponse?.pivot?.length > 0) {
          pivot = queryResponse?.pivot[0]
        }
        return getCrossfilterSelection(row, pivot)
      }
    }
    return undefined
  }, [isDashboardCrossFilteringEnabled, visualizationSDK, visualizationData])

  const currentCrossFiltersSelectionDesc = useMemo(() => {
    if (!isExploring) {
      switch (currentCrossFiltersSelection) {
        case CrossfilterSelection.NONE: {
          return 'None'
        }
        case CrossfilterSelection.SELECTED: {
          return 'Selected'
        }
        case CrossfilterSelection.UNSELECTED: {
          return 'Unselected'
        }
        default: {
          return isDashboardCrossFilteringEnabled
            ? 'Unknown'
            : 'Cross filtering disabled'
        }
      }
    }
    return 'Not supported when exploring'
  }, [
    currentCrossFiltersSelection,
    isDashboardCrossFilteringEnabled,
    isExploring,
  ])

  const addErrorsClick = useCallback(() => {
    tileSDK.addErrors({
      title: 'Oh no',
      message: "I've fallen and I can't get up!",
    })
  }, [tileSDK])

  const clearErrorsClick = useCallback(() => {
    tileSDK.clearErrors()
  }, [tileSDK])

  const buildEvent = useCallback((buttonRef) => {
    let event = { pageX: 0, pageY: 0 }
    if (buttonRef.current) {
      const { bottom, left } = buttonRef.current.getBoundingClientRect()
      // Add 95px to the x coordinate to shift the menu
      // under the button.
      event = { pageX: left + 95, pageY: bottom }
    }
    return event
  }, [])

  const triggerClick = useCallback(
    (event) => {
      // Taken from custom visualizations 2
      const defaultColors = {
        red: '#F36254',
        green: '#4FBC89',
        yellow: '#FCF758',
        white: '#FFFFFF',
      }
      tileSDK.trigger(
        'updateConfig',
        [
          { lowColor: defaultColors.red },
          { midColor: defaultColors.white },
          { highColor: defaultColors.green },
        ],
        event
      )
    },
    [tileSDK]
  )

  const toggleCrossFilterClick = useCallback(
    (event) => {
      if (isDashboardCrossFilteringEnabled && visualizationSDK) {
        const queryResponse = visualizationSDK.queryResponse
        if (queryResponse) {
          let row
          let pivot
          if (queryResponse?.data.length > 0) {
            row = queryResponse?.data[0]
          }
          if (queryResponse?.pivot?.length > 0) {
            pivot = queryResponse?.pivot[0]
          }
          tileSDK.toggleCrossFilter(
            { pivot, row },
            buildEvent(toggleCrossFilterButtonRef)
          )
        }
      }
    },
    [
      tileSDK,
      isDashboardCrossFilteringEnabled,
      visualizationSDK,
      visualizationData,
    ]
  )

  const openDrillMenuClick = useCallback(
    (_event) => {
      const links = getDrillLinks(visualizationData?.queryResponse?.data, 0, 0)
      if (links.length === 0) {
        tileSDK.addErrors({
          title: 'Drilling Error',
          message: 'No drill links found',
        })
      } else {
        tileSDK.openDrillMenu({ links }, buildEvent(openDrillMenuButtonRef))
      }
    },
    [tileSDK, visualizationData]
  )

  const runDashboardClick = useCallback(() => {
    tileSDK.runDashboard()
  }, [tileSDK])

  const stopDashboardClick = useCallback(() => {
    tileSDK.stopDashboard()
  }, [tileSDK])

  const updateFiltersClick = useCallback(() => {
    const updatedFilter = {}
    Object.entries(dashboardFilters || {}).forEach(([key, value]) => {
      updatedFilter[key] = value
      if (key === 'State') {
        updatedFilter[key] =
          value === 'California' ? 'Washington' : 'California'
      } else if (typeof value === 'string') {
        updatedFilter[key] = value.split('').reverse().join('')
      }
    })
    tileSDK.updateFilters(updatedFilter, runDashboard)
  }, [tileSDK, dashboardFilters, runDashboard])

  const openScheduleDialogClick = useCallback(() => {
    tileSDK.openScheduleDialog()
  }, [tileSDK])

  const updateTileClick = useCallback(() => {
    // For standalone extensions this updates the browser window/tab title.
    // For dashboard tiles, this updates the tile title if the title is
    // visible and the the dashboard is not being edited. The title is NOT
    // persisted to the dashboard configuration. The original title is
    // displayed when the dashboard is in edit mode.
    // For extensions displayed in explores this call is ignored.
    extensionSDK.updateTitle(`Update tile title ${new Date().getSeconds()}`)
  }, [extensionSDK])

  return (
    <Card>
      <CardContent>
        <Accordion2 label="Event Tester" defaultOpen>
          <Grid columns={2} mt="medium">
            <ButtonOutline onClick={addErrorsClick} width="100%">
              Test add errors
            </ButtonOutline>
            <ButtonOutline onClick={clearErrorsClick} width="100%">
              Test clear errors
            </ButtonOutline>
            <ButtonOutline
              onClick={runDashboardClick}
              width="100%"
              disabled={isExploring}
            >
              Test run dashboard
            </ButtonOutline>
            <ButtonOutline
              onClick={stopDashboardClick}
              width="100%"
              disabled={isExploring}
            >
              Test stop dashboard
            </ButtonOutline>
            <ButtonOutline
              onClick={triggerClick}
              width="100%"
              disabled={!visualizationData}
            >
              Test trigger
            </ButtonOutline>
            <ButtonOutline
              onClick={openDrillMenuClick}
              width="100%"
              ref={openDrillMenuButtonRef}
            >
              Test open drill menu
            </ButtonOutline>
            <ButtonOutline
              onClick={toggleCrossFilterClick}
              width="100%"
              disabled={!visualizationData || isExploring}
              ref={toggleCrossFilterButtonRef}
            >
              Test toggle cross filter
            </ButtonOutline>
            <Space width="100%">
              <Paragraph width="100%">
                Cross filter selection: {currentCrossFiltersSelectionDesc}
              </Paragraph>
            </Space>
            <ButtonOutline onClick={updateFiltersClick}>
              Test update filters
            </ButtonOutline>
            <FieldToggleSwitch
              label="Run dashboard"
              onChange={(event) => setRunDashboard(event.target.checked)}
              on={runDashboard}
            ></FieldToggleSwitch>
            <ButtonOutline
              onClick={openScheduleDialogClick}
              width="100%"
              disabled={isExploring || isDashboardEditing}
            >
              Test open schedule dialog
            </ButtonOutline>
            <ButtonOutline onClick={updateTileClick} width="100%">
              Update title title
            </ButtonOutline>
          </Grid>
        </Accordion2>
      </CardContent>
    </Card>
  )
}
