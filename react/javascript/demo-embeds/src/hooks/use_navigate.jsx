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
import { useHistory } from 'react-router-dom'
import { useCurrentRoute } from '.'

export const useNavigate = (expectedEmbedType) => {
  const history = useHistory()
  const { searchCriteria, embedType, embedId } =
    useCurrentRoute(expectedEmbedType)

  const updateSearchCriteria = (criteria = '') => {
    const newCriteria = encodeURIComponent(criteria.trim())
    if (newCriteria !== searchCriteria) {
      history.push(`/${embedType}/${newCriteria}/${embedId || ''}`)
    }
  }

  const updateEmbedType = (type = '') => {
    if (type.trim() !== embedType) {
      history.push(`/${type.trim()}//`)
    }
  }

  const updateEmbedId = (id = '') => {
    if (id.trim() !== embedId) {
      history.push(`/${embedType}/${searchCriteria}/${id}`)
    }
  }

  return { updateEmbedId, updateEmbedType, updateSearchCriteria }
}
