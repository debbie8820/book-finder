const request = require('request')

module.exports = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) return reject(err)
      return resolve(body)
    })
  })
}