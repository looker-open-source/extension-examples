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

// Authorization options
export enum AuthOption {
  Custom = 'Custom',
  Google = 'Google',
  Github = 'Github',
  Auth0 = 'Auth0',
  Auth0Alt = 'Auth0Alt',
}

// Posts server

export const POSTS_SERVER_URL = process.env.POSTS_SERVER_URL || ''

// Centralize setup of client ids, keys and scopes

// The Google client id should be defined in the .env file. See README.md
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
export const GOOGLE_SCOPES =
  'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/userinfo.profile'

// The Github client id should be defined in the .env file. See README.md
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ''

// The Auth0 client id should be defined in the .env file. See README.md
export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || ''
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
export const AUTH0_SCOPES =
  'openid profile email https://www.googleapis.com/auth/spreadsheets.readonly'
// Auth0 will provide a domain to use for OAUTH authentication.
export const AUTH0_BASE_URL = process.env.AUTH0_BASE_URL || ''
