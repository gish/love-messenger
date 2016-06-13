import sha1 from 'sha1'

const auth = (input) => {
  const { given, expected, salt } = input

  if (salt) {
    const encryptedGiven = sha1(`${salt}${given}`)
    return encryptedGiven === expected
  }

  return given === expected
}

export default auth
