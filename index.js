import express from 'express'
import bodyParser from 'body-parser'
import sha1 from 'sha1'
import moment from 'moment'
import auth from './lib/auth.js'
import getMessageList from './lib/message-list.js'

const PORT = process.env.PORT || 8080
const SALT = process.env.SALT || 'def456'
const API_KEY = process.env.API_KEY || sha1(`${SALT}abc123`)
const MESSAGE_RECEIVER = process.env.MESSAGE_RECEIVER
const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1hqAPPlbwHrf8E8MuJ6QJSobAEliT3UFwN0xA3vp5-2Y'

const app = express()

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const givenApiKey = req.query['api-key']
  const authorized = auth({
    given: givenApiKey,
    expected: API_KEY,
    salt: SALT
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

  getMessageList(GOOGLE_SPREADSHEET_ID).then((messageList) => {
    const message = messageList.filter((message) => {
      return message.date === todaysDate
    })
    
    if (!message) {
      res.status(204)
      res.send('No message of the day')
    } else {
      res.status(202)
      res.send(message)
    }

  }).catch(() => {
    res.status(500)
    res.send('Error getting messages')
  })


  //sendLoveMessage(MESSAGE_RECEIVER, message)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
