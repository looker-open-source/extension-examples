import React, { ReactNode } from 'react'

export interface RouteAwareTab {
  label: string
  route: string
  component: ReactNode
}

export interface RouteAwareTabsProps {
  routeAwareTabs: RouteAwareTab[]
}
