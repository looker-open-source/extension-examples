/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
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

import { ILook } from "@looker/sdk"
import { Actions, Action, RunLookSuccess } from '.'

export interface State {
  loading: boolean
  error?: string
  looks?: ILook[]
  currentLookId?: number
  queries: Record<string, Record<string, any>>
}

const defaultState: Readonly<State> = Object.freeze({
  loading: false,
  queries: {},
})

export const reducer = (
  state: State = defaultState,
  action: Action
): State => {
  switch (action.type) {
    case Actions.ALL_LOOKS_REQUEST:
    case Actions.RUN_LOOK_REQUEST:
      return {
        ...state,
        currentLookId: action.payload as number,
        loading: true,
        error: undefined
      }
    case Actions.ALL_LOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        looks: action.payload as ILook[]
      }
    case Actions.RUN_LOOK_SUCCESS:
      const { lookId, result } = action.payload as RunLookSuccess
      const newState = {
        ...state,
        loading: false,
        queries: {
          ...state.queries,
          [lookId]: result
        }
      }
      return newState
    case Actions.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload as string
      }
    default:
        return state
    }
}
