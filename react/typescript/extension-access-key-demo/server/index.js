/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Looker Data Sciences, Inc.
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

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

/**
 * A test server that serves up test json data and that can
 * protect that data if needed. A request must have an Authorization
 * header to access the data.
 *
 * User can sign in and an authorization token will be created.
 * The token will last for one hour after which the user has to
 * log in again. It does not automatically extend.
 *
 * The user can sign in using a google access token and expiration
 * (obtained by using the OAUTH2 implicit flow in the web client).
 * If the token is valid (determined by calling the google token
 * info server) a server token is created using the expiration as the
 * length of the token.
 */

// Provide access to values in .env file
dotenv.config()

// Key for signing JWT tokens. DO NOT DO THIS IN A PRODUCTION APP.
const JWT_KEY = process.env.JWT_TOKEN_SECRET
if (!JWT_KEY || JWT_KEY.trim() === '') {
  console.error('JWT_TOKEN_SECRET not defined. Please add to .env file.')
  process.exit(-1)
}

// Cors required
app.use(cors())
// Body parser middleware
app.use(bodyParser.json())

/**
 * Middleware to validate the JWT token. If valid user data gets stored
 * on the request object.
 * With the advent of the SameSite attribute of cookies, added support
 * for the token in the Authorization header instead of cookies.
 */
app.use((req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    try {
      const payload = jwt.verify(token, JWT_KEY)
      req.currentUser = payload
    } catch (err) {
      // most likely token has expires. Could also be tampering with
      // token but this is a test application so it does not really
      // matter.
    }
  }
  next()
})

/**
 * Access check
 */
app.post('/access_check', async (req, res) => {
  const { name, email, access_key } = req.body
  // validate the access key. Simple in memory check for demo
  // purposes.
  if (access_key !== process.env.ACCESS_KEY) {
    res.status(401).send()
    return
  }
  // In theory the email could be used to check if the user is
  // authorized to access the data server. As this is just
  // sample code we just grant access.
  console.log(`${email}/${name} allowed to use the JSON server`)
  // Create the JWT token for the session.
  const options = {
    expiresIn: 3600,
  }
  const userJwt = jwt.sign({ ...req.body }, JWT_KEY, options)
  res.set('Content-Type', 'application/json')
  // IMPORTANT - NEVER RETURN THE ACCESS KEY IN THE RESPONSE!
  // THE LOOKER SERVER WILL NOT DETECT AND REMOVE THE ACCESS FROM
  // THE RESPONSE. THIS MEANS THAT THE KEY WILL BE EXPOSED IN THE
  // BROWSER WHICH IS INSECURE.
  res.status(200).send({ jwt_token: userJwt })
})

/**
 * All data requests go through this guard first.
 * If currentUser is not found on the request (see
 * above for how that happens), the user is not logged in
 * and a 401 response is returned.
 */
app.use((req, res, next) => {
  // If currentUser is present, user is authorized
  if (req.currentUser) {
    next()
  } else {
    res.sendStatus(401)
  }
})

/**
 * Ping to validate a jwt token
 */
app.get('/ping', async (req, res) => {
  res.status(200).send({})
})

/**
 * Listen
 */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
