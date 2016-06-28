import request from 'request'
import setupLogger from './logger'

const logger = setupLogger({})

const sendLoveMessage = (opts) => {
  const {
    senderName,
    receiverNumber,
    message,
    username,
    password
  } = opts

  return new Promise((resolve, reject) => {
        logger.log('info', `[loveMessage] Sent message "${message}" to ${receiverNumber}`)
    request.post('https://api.46elks.com/a1/SMS', {
      form: {
        from: senderName,
        to: receiverNumber,
        message: message
      },
      auth: {
        'user': username + "a",
        'pass': password
      }
    }, (error, response, body) => {
      if (error) {
        logger.log('error', `[loveMessage] Error sending message. Response: ${body}`)
        reject(response)
      } else {
        logger.log('debug', `[loveMessage] Response: ${body}`)
        resolve(body)
      }
    })
  })
}

export default sendLoveMessage
