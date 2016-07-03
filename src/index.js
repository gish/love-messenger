import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import moment from 'moment'
import authMiddleware from './middleware/auth'
import requireReceiverNumber from './middleware/require-receiver-number'
import getMessageList from './lib/message-list'
import sendLoveMessage from './lib/send-love-message'
import getRequiredKey from './lib/get-required-key'
import loggerFactory from './lib/logger'

const isDevelopment = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')

if (isDevelopment) {
  dotenv.load()
}

const requiredKeys = [
  'API_KEY',
  'ELKS_API_PASSWORD',
  'ELKS_API_USERNAME',
  'GOOGLE_SPREADSHEET_ID',
  'MESSAGE_SENDER_NAME'
]

const config = requiredKeys.reduce((obj, requiredKey) => {
  obj[requiredKey] = getRequiredKey(process.env, requiredKey)
  return obj
}, {})

config.PORT = process.env.PORT || 8080

const logger = loggerFactory({
  level: 'debug',
  slack: {
    apiToken: process.env.SLACK_API_TOKEN,
    domain: process.env.SLACK_DOMAIN,
    logLevel: process.env.SLACK_LOG_LEVEL,
    channel: process.env.SLACK_CHANNEL,
    userName: process.env.SLACK_USERNAME
  }
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(authMiddleware({
  apiKey: config.API_KEY
}))

// POST message
app.post('/message', requireReceiverNumber, (req, res) => {
  const todaysDate = moment().format('YYYY-MM-DD')
  const receiverNumber = req.body['receiver_number']

  logger.debug(`Got receiver ${receiverNumber}`)
  logger.debug('Got message POST request')

  getMessageList(config.GOOGLE_SPREADSHEET_ID)
  .then((messageList) => {
    const message = messageList.filter((message) => {
      return message.date === todaysDate
    })[0]
    const messageText = message.message || ''

    if (messageText.length === 0) {
      logger.info('No message of the day')

      res.status(204)
      res.send('No message of the day')
    } else {
      logger.debug(`Trying to send message "${messageText}"`)
      sendLoveMessage({
        senderName: config.MESSAGE_SENDER_NAME,
        receiverNumber: receiverNumber,
        message: messageText,
        username: config.ELKS_API_USERNAME,
        password: config.ELKS_API_PASSWORD,
        logger: logger,
        dryRun: isDevelopment
      })
      .then(() => {
        const receiverNumber = config.MESSAGE_RECEIVER_NUMBER
        logger.info(`Sent message "${messageText}" to ${receiverNumber}`)

        res.status(202)
        res.send(`Sent message "${messageText}"`)
      })
      .catch(() => {
        res.status(500)
        res.send('Error sending message')
      })
    }
  }).catch(() => {
    res.status(500)
    res.send('Error getting messages')
  })
})

app.listen(config.PORT, () => {
  logger.debug(`Server running on port ${config.PORT}`)
  logger.debug(`Config:`, config)
})
