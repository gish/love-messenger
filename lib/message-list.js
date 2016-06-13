const request = require('request')
const getMessageList = (spreadsheetId) => {
  return new Promise((resolve, reject) => {
    const url = `https://spreadsheets.google.com/feeds/list/${spreadsheetId}/od6/public/values?alt=json`
    request.get(url, (error, response, body) => {
      if (error) {
        reject(error)
        return
      }

      const bodyAsJson = JSON.parse(body)
      const messages = bodyAsJson.feed.entry.map((entry) => {
        const date = entry.gsx$date.$t
        const message = entry.gsx$message.$t

        return {
          date,
          message
        }
      })

      resolve(messages)
    })
  })
}
export default getMessageList
