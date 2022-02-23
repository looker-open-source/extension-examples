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

import * as React from 'react'
import type { MenuItemProps } from '@looker/components'
import { Box, MenuList, MenuItem } from '@looker/components'
import { SqlRunner, Explore, AnalyticsApp } from '@looker/icons'
import {
  Home as HomeIcon,
  Api,
  Dashboard,
  Settings,
  Cloud,
  More,
} from '@styled-icons/material'
import type { LinkProps } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import omit from 'lodash/omit'
import { ROUTES } from '../../KitchenSink'
import type { SidebarProps } from './'

export const Sidebar: React.FC<SidebarProps> = ({
  route,
  configurationData,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <MenuList type="none">
        <StyledRouterLink to={ROUTES.HOME_ROUTE}>
          <MenuItem icon={<HomeIcon />} selected={route === ROUTES.HOME_ROUTE}>
            Home
          </MenuItem>
        </StyledRouterLink>
        {configurationData.showApiFunctions && (
          <StyledRouterLink to={ROUTES.API_ROUTE}>
            <MenuItem icon={<Api />} selected={route === ROUTES.API_ROUTE}>
              Api Functions
            </MenuItem>
          </StyledRouterLink>
        )}
        {configurationData.showCoreSdkFunctions && (
          <StyledRouterLink to={ROUTES.CORESDK_ROUTE}>
            <MenuItem
              icon={<SqlRunner />}
              selected={route.startsWith(ROUTES.CORESDK_ROUTE)}
            >
              Core SDK Functions
            </MenuItem>
          </StyledRouterLink>
        )}
        {configurationData.showEmbedDashboard && (
          <StyledRouterLink to={ROUTES.EMBED_DASHBOARD}>
            <MenuItem
              icon={<Dashboard />}
              selected={route === ROUTES.EMBED_DASHBOARD}
            >
              Embed Dashboard
            </MenuItem>
          </StyledRouterLink>
        )}
        {configurationData.showEmbedExplore && (
          <StyledRouterLink to={ROUTES.EMBED_EXPLORE}>
            <MenuItem
              icon={<Explore />}
              selected={route === ROUTES.EMBED_EXPLORE}
            >
              Embed Explore
            </MenuItem>
          </StyledRouterLink>
        )}
        {configurationData.showEmbedLook && (
          <StyledRouterLink to={ROUTES.EMBED_LOOK}>
            <MenuItem
              icon={<AnalyticsApp />}
              selected={route === ROUTES.EMBED_LOOK}
            >
              Embed Look
            </MenuItem>
          </StyledRouterLink>
        )}
        {configurationData.showExternalApiFunctions && (
          <StyledRouterLink to={ROUTES.EXTERNAL_API_ROUTE}>
            <MenuItem
              icon={<Cloud />}
              selected={route.startsWith(ROUTES.EXTERNAL_API_ROUTE)}
            >
              External Api Functions
            </MenuItem>
          </StyledRouterLink>
        )}
        {configurationData.showMiscFunctions && (
          <StyledRouterLink to={ROUTES.MISC_ROUTE}>
            <MenuItem icon={<More />} selected={route === ROUTES.MISC_ROUTE}>
              Miscellaneous Functions
            </MenuItem>
          </StyledRouterLink>
        )}
        <StyledRouterLink to={ROUTES.CONFIG_ROUTE}>
          <MenuItem
            icon={<Settings />}
            selected={route === ROUTES.CONFIG_ROUTE}
          >
            Configure
          </MenuItem>
        </StyledRouterLink>
      </MenuList>
    </Box>
  )
}

const StyledRouterLinkInner: React.FC<LinkProps & MenuItemProps> = (props) => (
  <RouterLink {...omit(props, 'customizationProps')} />
)

const StyledRouterLink = styled(StyledRouterLinkInner)`
  text-decoration: none;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`
