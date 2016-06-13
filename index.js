import express from 'express'
import bodyParser from 'body-parser'
import auth from './lib/auth.js'

const PORT = process.env.PORT || 8080
const API_KEY = process.env.API_KEY || 'abc123'
const SALT = process.env.SALT || 'def456'
const app = express()

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const givenApiKey = req.query['api-key']

  if (auth({
    given: givenApiKey,
    expected: API_KEY,
    salt: SALT
  })) {
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
  res.status(202)
  res.send('send message')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
