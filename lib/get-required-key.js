const getRequiredKey = (obj, key) => {
  if (obj.hasOwnProperty(key)) {
    return obj[key]
  }

  return false
}

export default getRequiredKey
