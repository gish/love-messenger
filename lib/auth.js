
const auth = (input) => {
  const { given, expected } = input

  return given === expected
}

export default auth
