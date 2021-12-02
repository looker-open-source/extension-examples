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
import { useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

/**
 * Spartan link hook.
 *
 * This hook should be used at the top of the component
 * tree.
 *
 * Handle a link sent from an embed to a spartan user.
 * The link is crafted to go the spartan users home page
 * with the link to re-instantiate the embed as the link
 * parameter in the query string.
 * The extension is reponsible for mapping the Looker UI
 * formatted URL to the extensions URL (this here hook!).
 *
 * * @returns true if url contains a spartan link.
 */
export const useSpartanLink = () => {
  const [linkParam, setLinkParam] = useState()
  const { search, pathname } = useLocation()
  const history = useHistory()

  useEffect(() => {
    if (search) {
      const searchParams = new URLSearchParams(search)
      const link = searchParams.get('link')
      if (link !== linkParam) {
        setLinkParam(link)
      }
    } else {
      setLinkParam(undefined)
    }
  }, [search])

  useEffect(() => {
    if (linkParam) {
      try {
        const link = decodeURIComponent(linkParam)
        const linkParts = link.split('/')
        console.log({ link, linkParts })
        if (linkParts[1] === 'dashboards') {
          history.replace(`/dashboards//${linkParts[2].split('?')[0]}`)
        } else if (linkParts[1] === 'explore') {
          console.log({ linkParts })
          history.replace(
            `/explores//${linkParts[2]}::${linkParts[3].split('?')[0]}`
          )
        } else if (linkParts[1] === 'looks') {
          history.replace(`/looks//${linkParts[2].split('?')[0]}`)
        } else {
          history.replace(pathname)
        }
      } catch (err) {
        // Very simplistic error handling for demo purposes.
        console.error(err)
        history.replace(pathname)
      }
    }
  }, [linkParam])

  // Return true if a link is present. For the embed demo the rendering
  // of the UI is delayed until after the link parameter has been processed
  // and removed from the URL. This avoids and potentential for flicker.
  return !!linkParam
}
