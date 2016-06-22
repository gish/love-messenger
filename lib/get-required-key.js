const getRequiredKey = (obj, key) => {
  if (obj.hasOwnProperty(key)) {
    return obj[key]
  } else {
    console.error(`[getRequiredKey] ${key} not defined`)
    process.exit(1)
    return false
  }
}

export default getRequiredKey
