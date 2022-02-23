/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 Looker Data Sciences, Inc.
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

import {
  connectExtensionHost,
  LookerExtensionSDK40,
} from '@looker/extension-sdk'

;(async () => {
  const extensionSdk = await connectExtensionHost()
  const sdk40 = LookerExtensionSDK40.createClient(extensionSdk)
  const result = await sdk40.me()
  const name = result.ok ? result.value.display_name : 'Unknown'
  document.write(`
  <style>
    body {
      font-family: -apple-system, system-ui, BlinkMacSystemFont;
      text-align:center;
      font-variant-numeric: tabular-nums;
    }
    .butt {
      font-size: 100px;
      background: salmon;
      border-radius: 250px;
      padding: 20px;
      display: inline-block;
      min-width: 200px;
      user-select: none;
    }
    .butt:active {
      background-color: orangered;
    }
    .webpage {
      padding: 100px 0;
    }
  </style>
  <div class="webpage">
    <h1>Looker Counter Extension</h1>
    <h2>Welcome ${name}</h2>
    <h3>This number will increase by one upon every click:</h3>
    <div class="butt" onclick="event.target.innerHTML = +event.target.innerHTML + (event.shiftKey ? -1 : 1); event.preventDefault
    ()">0</div>
    <h3>I hope you had fun with this Looker extension.</h3>
    <img width="200" src="https://docs.looker.com/assets/site_images/looker-logo.svg" />
  </div>
`)
})()
