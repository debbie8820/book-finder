const cheerio = require('cheerio')

module.exports = async (URL, keyword) => {
  try {
    const BOOK_encoded = encodeURI(URL).replace('+', '%20')
    const BOOK_body = await require('../utils/getUrl')(BOOK_encoded)
    const BOOK$ = cheerio.load(BOOK_body)
    const allTbodies = BOOK$('.table-searchlist tbody')
    const books = []

    for (let i = 0; i < allTbodies.length; i++) {
      const tbody = allTbodies.eq(i)
      const regex = new RegExp(keyword, 'i')
      const name = tbody.find('td').eq(1).find('a').attr('title')
      const author = tbody.find('td').eq(2).find('.list-date li a').eq(0).attr('title')

      if (regex.test(name) || regex.test(author)) {

        const productNumber = tbody.attr('id')
        const url = tbody.find('td').eq(1).find('a').attr('href')
        const img = tbody.find('td').eq(1).find('img').attr('data-src')
        const stock = tbody.find('td').eq(3).find('a').html() ? 1 : 0
        const StoreId = 5
        const allPrices = tbody.find('td').eq(2).find('.list-nav strong').length //區分折扣和真正價錢
        let price
        let discount = 0
        if (allPrices > 1) {
          price = tbody.find('td').eq(2).find('.list-nav strong').eq(1).text()
          discount = tbody.find('td').eq(2).find('.list-nav strong').eq(0).text()
        } else {
          price = tbody.find('td').eq(2).find('.list-nav strong').text()
        }
        const product = { productNumber, name, url, img, author, stock, StoreId, discount, price }
        books.push(product)
      }
    }
    return { books }
  }
  catch (err) {
    throw err
  }
}