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
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { ExtensionContext2 } from '@looker/extension-sdk-react'
import { sortByTitle } from './utils'

const all = async (coreSDK) => {
  try {
    const data = await coreSDK.ok(coreSDK.all_dashboards('id,title'))
    data.sort(sortByTitle)
    return data
  } catch (err) {
    throw new Error('Error retrieving dashboards')
  }
}

export const useAllDashboards = () => {
  const { coreSDK } = useContext(ExtensionContext2)
  return useQuery(['all_dashboards'], () => all(coreSDK), {
    enabled: true,
    staleTime: Infinity,
  })
}
