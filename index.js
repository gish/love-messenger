import express from 'express'
import bodyParser from 'body-parser'
import moment from 'moment'
import auth from './lib/auth.js'
import getMessageList from './lib/message-list'
import sendLoveMessage from './lib/send-love-message'

const PORT = process.env.PORT || 8080
const API_KEY = process.env.API_KEY || 'abc123'
const MESSAGE_SENDER_NAME = process.env.MESSAGE_SENDER_NAME
const MESSAGE_RECEIVER_NUMBER = process.env.MESSAGE_RECEIVER_NUMBER
const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1hqAPPlbwHrf8E8MuJ6QJSobAEliT3UFwN0xA3vp5-2Y'
const ELKS_API_USERNAME = process.env.ELKS_API_USERNAME
const ELKS_API_PASSWORD = process.env.ELKS_API_PASSWORD

const app = express()

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const givenApiKey = req.query['key']
  const authorized = auth({
    given: givenApiKey,
    expected: API_KEY
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

  getMessageList(GOOGLE_SPREADSHEET_ID)
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
        senderName: MESSAGE_SENDER_NAME,
        receiverNumber: MESSAGE_RECEIVER_NUMBER,
        message: messageText,
        username: ELKS_API_USERNAME,
        password: ELKS_API_PASSWORD
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API key: ${API_KEY}`)
})
