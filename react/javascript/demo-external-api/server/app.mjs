import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { ManagementClient } from 'auth0'

dotenv.config()

const googleApiKey = process.env.GOOGLE_API_KEY
const auth0ClientId = process.env.AUTH0_CLIENT_ID
const auth0BaseUrl = process.env.AUTH0_BASE_URL

const app = express()

app.use(morgan('combined'))
app.use(cors())

app.get('/sheets/:id/:range', async (req, res) => {
  try {
    const [_, auth0ClientToken] = (req.headers['authorization'] || '').split(
      ' '
    )
    if (!auth0ClientToken) {
      res.status(401).send('Not authorized - missing authorization token')
      return
    }
    const profileResponse = await fetch(`${auth0BaseUrl}/userinfo`, {
      headers: {
        Authorization: `Bearer ${auth0ClientToken}`,
      },
    })
    if (!profileResponse.ok) {
      res.status(401).send('Not authorized - invalid authorization token')
      return
    }
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${req.params.id}/values/${req.params.range}?key=${googleApiKey}`
    )
    res.status(response.status).send(await response.json())
  } catch (error) {
    let status = 500
    if (error.response) {
      console.error('data', error.response.data)
      console.error('status', error.response.status)
      console.error('errors', error.response.headers)
      status = error.response.status
    } else if (error.request) {
      console.error('request', error.request)
    } else {
      console.error('errror', error.message)
    }
    res.status(status).send({})
  }
})

const port = 3000
app.listen(port, () => {
  console.info(`Listening on port ${port}`)
})
