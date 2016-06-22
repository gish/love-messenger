import express from 'express'
import bodyParser from 'body-parser'
import moment from 'moment'
import auth from './lib/auth.js'
import getMessageList from './lib/message-list'
import sendLoveMessage from './lib/send-love-message'
import getRequiredKey from './lib/get-required-key'

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

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const givenApiKey = req.query['key']
  const authorized = auth({
    given: givenApiKey,
    expected: config.API_KEY
  })

  if (authorized) {
    next()
  } else {
    res.status(401)
    res.send('Invalid API key')
  }
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(authMiddleware)

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
      res.send('No message of the day')
      res.status(204)
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
        res.send(`Sent message "${messageText}"`)
        res.status(202)
      })
      .catch(() => {
        res.send('Error sending message')
        res.status(500)
      })
    }
  }).catch(() => {
    res.send('Error getting messages')
    res.status(500)
  })
})

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
  console.log(`Config:`)
  console.log(config)
})
