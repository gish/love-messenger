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

  res.status(202)
  getMessageList(GOOGLE_SPREADSHEET_ID).then((messageList) => {
    console.log(messageList)
    res.send(messageList)
  })

  //getMessageList(googleHandler).then((list) => {
   // message = getMessage(messageList, todaysDate)

    //sendLoveMessage(MESSAGE_RECEIVER, message)
  //})
  //const googleHandler = undefined

  //res.send('send message')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
