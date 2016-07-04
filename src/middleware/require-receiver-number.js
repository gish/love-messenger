const requireReceiverNumber = (req, res, next) => {
  const numberRegex = /^([+]46)7[0236]\d{7}$/
  const receiverNumber = req.body['receiver_number'] || ''
  const validNumber = numberRegex.test(receiverNumber)

  if (!receiverNumber) {
    res.status(400)
    res.send('Missing parameter receiver_number')
    return
  }

  if (!validNumber) {
    res.status(400)
    res.send(`Invalid parameter receiver_number: ${receiverNumber}`)
    return
  }

  next()
}

export default requireReceiverNumber
