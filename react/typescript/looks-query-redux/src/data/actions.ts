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

export const Actions = {
  ALL_LOOKS_REQUEST:  'ALL_LOOKS_REQUEST',
  ALL_LOOKS_SUCCESS: 'ALL_LOOKS_SUCCESS',
  RUN_LOOK_REQUEST:  'RUN_LOOK_REQUEST',
  RUN_LOOK_SUCCESS: 'RUN_LOOK_SUCCESS',
  ERROR: 'ERROR'
}

export interface RunLookSuccess {
  lookId: number
  result: Record<string, any>
}

export interface Action {
  type: string
  payload?: ILook[] | string | number | RunLookSuccess
}

export const allLooksRequest = ():Action => ({
  type: Actions.ALL_LOOKS_REQUEST,
})

export const allLooksSuccess = (looks: ILook[]):Action => ({
  type: Actions.ALL_LOOKS_SUCCESS,
  payload: looks
})

export const runLookRequest = (lookId: number):Action => ({
  type: Actions.RUN_LOOK_REQUEST,
  payload: lookId
})

export const runLookSuccess = (lookId: number, result: Record<string, any>):Action => ({
  type: Actions.RUN_LOOK_SUCCESS,
  payload: {
    lookId,
    result
  }
})

export const error = (error: string):Action => ({
  type: Actions.ERROR,
  payload: error
})
