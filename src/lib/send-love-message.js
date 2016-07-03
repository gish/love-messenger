import request from 'request'

const sendLoveMessage = (opts) => {
  const {
    senderName,
    receiverNumber,
    message,
    username,
    password,
    logger,
    dryRun
  } = opts

  return new Promise((resolve, reject) => {
    if (dryRun) {
      logger.debug('Will not send message')
      resolve({})
      return
    }

    request.post('https://api.46elks.com/a1/SMS', {
      form: {
        from: senderName,
        to: receiverNumber,
        message: message
      },
      auth: {
        'user': username,
        'pass': password
      }
    }, (error, response, body) => {
      const statusCode = response.statusCode

      if (error || statusCode !== 200) {
        logger.error(`Error sending message. Response: ${body}`)
        reject(response)
      } else {
        logger.debug(`Response: ${body}`)
        resolve(body)
      }
    })
  })
}

export default sendLoveMessage
