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
import React, { useContext, useEffect, useState } from 'react'
import { ComponentsProvider, Text } from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { RouteAwareTabs, Counter } from './components'

export const SevenGuis: React.FC = () => {
  const { extensionSDK } = useContext(ExtensionContext)

  useEffect(() => {
    console.log(extensionSDK.getContextData())
  }, [extensionSDK])

  const routeAwareTabs = [
    { label: 'Counter', route: '/counter', component: <Counter /> },
    {
      label: 'Temperature Converter',
      route: '/temperature-converter',
      component: <Text>Temperature Converter</Text>,
    },
    {
      label: 'Flight Booker',
      route: '/flight-booker',
      component: <Text>Flight Booker</Text>,
    },
    {
      label: 'Timer',
      route: '/timer',
      component: <Text>Timer</Text>,
    },
    {
      label: 'CRUD',
      route: '/crud',
      component: <Text>CRUD</Text>,
    },
    {
      label: 'Circle Drawer',
      route: '/circle-drawer',
      component: <Text>Circle Drawer</Text>,
    },
    {
      label: 'Cells',
      route: '/cells',
      component: <Text>Cells</Text>,
    },
  ]

  return (
    <ComponentsProvider>
      <RouteAwareTabs routeAwareTabs={routeAwareTabs} />
    </ComponentsProvider>
  )
}
