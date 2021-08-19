const request = require('request')

module.exports = (url, keyword) => {
  const referer = encodeURI(`https://shopee.tw/search?keyword=${keyword}site=best-selling-books`)
  const options = {
    url: url,
    headers: {
      Connection: 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
      'x-api-source': 'pc'
    }
  }

  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) return reject(err)
      return resolve(body)
    })
  })
}