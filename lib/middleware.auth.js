const authMiddleware = (config) => (req, res, next) => {
  const givenApiKey = req.query['key']
  const authorized = givenApiKey === config.apiKey

  if (authorized) {
    next()
  } else {
    res.status(401)
    res.send('Invalid API key')
  }
}

export default authMiddleware
