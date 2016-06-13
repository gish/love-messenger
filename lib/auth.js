const auth = (input) => {
  const { given, expected, salt } = input
  return given === expected
}

export default auth
