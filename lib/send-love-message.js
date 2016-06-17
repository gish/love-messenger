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
        console.error(error)
        reject(response)
      } else {
        console.log(`[loveMessage] Sent "${message}" response: ${body}`)
        resolve(body)
      }
    })
  })
}

export default sendLoveMessage
