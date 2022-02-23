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

import { getCore40SDK } from '@looker/extension-sdk-react'
import { all, call, put, takeEvery, select } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { ILook } from '@looker/sdk'
import type { Action, State } from '.'
import { Actions, allLooksSuccess, runLookSuccess, reportError } from '.'

function* allLooksSaga(): SagaIterator {
  const coreSDK = getCore40SDK()
  try {
    const result = yield call([coreSDK, coreSDK.all_looks])
    const looks = yield call([coreSDK, coreSDK.ok], result)
    yield put(
      allLooksSuccess(looks.filter((look: ILook) => look.id).slice(0, 9))
    )
  } catch (err) {
    yield put(reportError('Error loading looks'))
  }
}

function* runLookSaga(action: Action): SagaIterator {
  try {
    const lookId = action.payload as string
    const state: State = yield select()
    if (state.queries[lookId]) {
      // fast display if query run previously - fresh data will be displayed later
      yield put(runLookSuccess(lookId, state.queries[lookId]))
    }
    const coreSDK = getCore40SDK()
    const result = yield call([coreSDK, coreSDK.run_look], {
      look_id: lookId,
      result_format: 'json',
    })
    const json = yield call([coreSDK, coreSDK.ok], result)
    yield put(runLookSuccess(lookId, json))
  } catch (err) {
    yield put(reportError('Error running look'))
  }
}

export function* sagaCallbacks(): SagaIterator {
  yield all([
    takeEvery(Actions.ALL_LOOKS_REQUEST, allLooksSaga),
    takeEvery(Actions.RUN_LOOK_REQUEST, runLookSaga),
  ])
}
