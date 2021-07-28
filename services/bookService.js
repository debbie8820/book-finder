const request = require('request')
const cheerio = require('cheerio')

const getUrl = (url) => { //處理差不多再來重構
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) return reject(err)
      return resolve(body)
    })
  })
}

const bookService = {
  searchBooks: async (keyword) => {
    try {
      const url = `https://search.books.com.tw/search/query/key/${keyword}/cat/all/fclick/autocomp` //博客來
      const result = await getUrl(url)
      return result
    }
    catch (err) {
      throw err
    }
  }
}

module.exports = bookService