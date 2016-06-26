import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import moment from 'moment'
import authMiddleware from './lib/middleware.auth'
import getMessageList from './lib/message-list'
import sendLoveMessage from './lib/send-love-message'
import getRequiredKey from './lib/get-required-key'

const isDevelopment = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')

if (isDevelopment) {
  dotenv.load()
}

const requiredKeys = [
  'API_KEY',
  'ELKS_API_PASSWORD',
  'ELKS_API_USERNAME',
  'GOOGLE_SPREADSHEET_ID',
  'MESSAGE_RECEIVER_NUMBER',
  'MESSAGE_SENDER_NAME',
  'PORT'
]

const config = requiredKeys.reduce((obj, requiredKey) => {
  obj[requiredKey] = getRequiredKey(process.env, requiredKey)
  return obj
}, {})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(authMiddleware({
  apiKey: config.API_KEY
}))

// POST message
app.post('/message', (req, res) => {
  const todaysDate = moment().format('YYYY-MM-DD')

  console.log(`Got message POST request`)

  getMessageList(config.GOOGLE_SPREADSHEET_ID)
  .then((messageList) => {
    const message = messageList.filter((message) => {
      return message.date === todaysDate
    })[0]
    const messageText = message.message || ''

    if (messageText.length === 0) {
      console.log('No message of the day')
      res.status(204)
      res.send('No message of the day')
    } else {
      console.log(`Trying to send message "${messageText}"`)
      sendLoveMessage({
        senderName: config.MESSAGE_SENDER_NAME,
        receiverNumber: config.MESSAGE_RECEIVER_NUMBER,
        message: messageText,
        username: config.ELKS_API_USERNAME,
        password: config.ELKS_API_PASSWORD
      })
      .then(() => {
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
  console.log(`Server running on port ${config.PORT}`)
  console.log(`Config:`)
  console.log(config)
})
