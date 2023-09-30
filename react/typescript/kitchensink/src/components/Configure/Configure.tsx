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

import React, { useContext, useEffect, useState } from 'react'
import type { ValidationMessages } from '@looker/components'
import {
  Button,
  ButtonOutline,
  Form,
  FieldCheckbox,
  FieldText,
  Heading,
  SpaceVertical,
  FieldTextArea,
} from '@looker/components'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { SandboxStatus } from '../SandboxStatus'
import type { ConfigurationData } from '../../types'
import type { ConfigureProps } from './types'

const Configure: React.FC<ConfigureProps> = ({
  canPersistContextData,
  configurationData,
  updateConfigurationData,
}) => {
  const [localConfigurationData, setLocalConfigurationData] =
    useState<ConfigurationData>({
      dashboardId: '',
      exploreId: '',
      lookId: '',
    } as ConfigurationData)
  const extensionContext =
    useContext<ExtensionContextData40>(ExtensionContext40)
  const { extensionSDK } = extensionContext

  useEffect(() => {
    const initialize = async () => {
      if (canPersistContextData) {
        try {
          const contextData = await extensionSDK.refreshContextData()
          if (contextData) {
            setLocalConfigurationData(contextData as ConfigurationData)
          }
        } catch (error) {
          console.error('failed to get latest context data', error)
        }
      }
    }
    setLocalConfigurationData({ ...configurationData })
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleApiFunctions = () => {
    localConfigurationData.showApiFunctions =
      !localConfigurationData.showApiFunctions
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const toggleCoreSdkFunctions = () => {
    localConfigurationData.showCoreSdkFunctions =
      !localConfigurationData.showCoreSdkFunctions
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const toggleEmbedDashboard = () => {
    localConfigurationData.showEmbedDashboard =
      !localConfigurationData.showEmbedDashboard
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const toggleEmbedExplore = () => {
    localConfigurationData.showEmbedExplore =
      !localConfigurationData.showEmbedExplore
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const toggleEmbedLook = () => {
    localConfigurationData.showEmbedLook = !localConfigurationData.showEmbedLook
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const toggleExternalApiFunctions = () => {
    localConfigurationData.showExternalApiFunctions =
      !localConfigurationData.showExternalApiFunctions
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const toggleMiscFunctions = () => {
    localConfigurationData.showMiscFunctions =
      !localConfigurationData.showMiscFunctions
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const validateValue = (value: string): number | string => {
    if (value.match(/\d+/g)) {
      return parseInt(value, 10)
    } else {
      return value
    }
  }

  const changeDashboardId = (event: React.ChangeEvent<HTMLInputElement>) => {
    localConfigurationData.dashboardId = validateValue(
      event.currentTarget.value
    )
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const changeExploreId = (event: React.ChangeEvent<HTMLInputElement>) => {
    localConfigurationData.exploreId = event.currentTarget.value
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const changeLookId = (event: React.ChangeEvent<HTMLInputElement>) => {
    localConfigurationData.lookId = validateValue(event.currentTarget.value)
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const changeThoughtForTheDay = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    localConfigurationData.thoughtForTheDay = event.currentTarget.value
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const changeImageData = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    localConfigurationData.imageData = event.currentTarget.value
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const getValidationMessages = (): ValidationMessages | undefined => {
    let validationMessages: ValidationMessages | undefined
    if (typeof localConfigurationData.dashboardId === 'string') {
      if (!validationMessages) {
        validationMessages = {}
      }
      validationMessages.dashboardId = {
        type: 'error',
        message: 'dashboard id is not numeric',
      }
    }
    if (localConfigurationData.exploreId === '') {
      if (!validationMessages) {
        validationMessages = {}
      }
      validationMessages.exploreId = {
        type: 'error',
        message: 'explore id is empty',
      }
    }
    if (typeof localConfigurationData.lookId === 'string') {
      if (!validationMessages) {
        validationMessages = {}
      }
      validationMessages.lookId = {
        type: 'error',
        message: 'look id is not numeric',
      }
    }
    return validationMessages
  }

  const onConfigChangeSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateConfigurationData({ ...localConfigurationData })
  }

  const onConfigResetClick = () => {
    setLocalConfigurationData({ ...configurationData })
  }

  const validationMessages = getValidationMessages()

  return (
    <>
      <Heading mt="xlarge">Configuration</Heading>
      <SandboxStatus />
      <Form
        width="50%"
        validationMessages={validationMessages}
        onSubmit={onConfigChangeSubmit}
      >
        <FieldCheckbox
          label="Show api functions"
          name="showApiFunctions"
          checked={localConfigurationData.showApiFunctions}
          onChange={toggleApiFunctions}
        />
        <FieldCheckbox
          label="Show core sdk functions"
          name="showCoreSdkFunctions"
          checked={localConfigurationData.showCoreSdkFunctions}
          onChange={toggleCoreSdkFunctions}
        />
        <FieldCheckbox
          label="Show embed dashboard"
          name="showEmbedDashboard"
          checked={localConfigurationData.showEmbedDashboard}
          onChange={toggleEmbedDashboard}
        />
        <FieldCheckbox
          label="Show embed explore"
          name="showEmbedExplore"
          checked={localConfigurationData.showEmbedExplore}
          onChange={toggleEmbedExplore}
        />
        <FieldCheckbox
          label="Show embed look"
          name="showEmbedLook"
          checked={localConfigurationData.showEmbedLook}
          onChange={toggleEmbedLook}
        />
        <FieldCheckbox
          label="Show external api functions"
          name="showExternalApiFunctions"
          checked={localConfigurationData.showExternalApiFunctions}
          onChange={toggleExternalApiFunctions}
        />
        <FieldCheckbox
          label="Show miscellaneous functions"
          name="showMiscFunctions"
          checked={localConfigurationData.showMiscFunctions}
          onChange={toggleMiscFunctions}
        />
        <FieldText
          label="Dashboard id"
          name="dashboardId"
          value={localConfigurationData.dashboardId}
          onChange={changeDashboardId}
        />
        <FieldText
          label="Explore id"
          name="exploreId"
          value={localConfigurationData.exploreId}
          onChange={changeExploreId}
        />
        <FieldText
          label="Look id"
          name="lookId"
          value={localConfigurationData.lookId}
          onChange={changeLookId}
        />
        <FieldTextArea
          label="Thought for the day"
          name="thoughtForTheDay"
          value={localConfigurationData.thoughtForTheDay || ''}
          onChange={changeThoughtForTheDay}
        />
        <FieldTextArea
          label="Image data"
          name="imageData"
          value={localConfigurationData.imageData || ''}
          onChange={changeImageData}
        />
        {localConfigurationData.imageData && (
          <img src={localConfigurationData.imageData} />
        )}
        <Button disabled={!!validationMessages}>Update configuration</Button>
      </Form>
      {canPersistContextData && (
        <SpaceVertical width="50%">
          <ButtonOutline onClick={onConfigResetClick}>
            Reset configuration
          </ButtonOutline>
        </SpaceVertical>
      )}
    </>
  )
}

export default Configure
