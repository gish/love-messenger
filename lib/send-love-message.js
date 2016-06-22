import request from 'request'

const sendLoveMessage = (opts) => {
  const {
    senderName,
    receiverNumber,
    message,
    username,
    password
  } = opts

  return new Promise((resolve, reject) => {
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
      if (error) {
        console.error(`[loveMessage] Error sending message. Response: ${body}`)
        reject(response)
      } else {
        console.log(`[loveMessage] Sent message ${message}`)
        console.log(`[loveMessage] Response: ${body}`)
        resolve(body)
      }
    })
  })
}

export default sendLoveMessage
