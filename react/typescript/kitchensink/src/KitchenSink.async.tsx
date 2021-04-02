import React, { lazy } from 'react'
import { KitchenSinkProps } from './types'

const KitchenSink = lazy<any>(
  async () => import(/* webpackChunkName: "kitchensink" */ './KitchenSink')
)

export const AsyncKitchenSink: React.FC<KitchenSinkProps> = (props) => (
  <KitchenSink {...props} />
)
