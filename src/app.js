import express, { json } from 'express'
import cors from 'cors'
import logger from './logging/logger'
import { checkForMessage } from './sqs/actions'
import authMiddleware from './middleware/authMiddleware'

// Setting port
const port = 4000
const app = express()
// Setting global polling frequency
global.globalPollingFrequency = 5000

app.use(
  json({ limit: '5mb' }),
  cors(),
  authMiddleware
)

app.listen(port, () => {
  logger(`Example app listening at http://localhost:${port}`)
  setTimeout(checkForMessage, globalPollingFrequency)
})

