const cheerio = require('cheerio')

module.exports = async (URL, keyword) => {
  try {
    const books = []
    const CITE_encoded = encodeURI(URL)
    const CITE_body = await require('../utils/getUrl')(CITE_encoded)
    const CITE$ = cheerio.load(CITE_body)
    const pages = CITE$('ul.page-numbers-1 li').eq(0).find('span.font-color01').eq(1).text()
    if (!pages) {
      return { books, pages: 0 }
    }
    const allLists = CITE$('.book-container li.book-area-1')

    let regex = new RegExp(keyword, 'i')

    if (keyword.split(' ').length > 1) { //若關鍵字中有空格，則進行切割並交錯比對
      let regexGroup = ''
      const splitedKeywords = keyword.split(' ')
      for (let i = 0; i < splitedKeywords.length; i++) {
        regexGroup += `(?=.*${splitedKeywords[i]})`
      }
      regex = new RegExp(regexGroup, 'i')
    }

    for (let i = 0; i < allLists.length; i++) {
      const allLists = CITE$('.book-container li.book-area-1')
      const name = allLists.eq(i).find('div.book-info-1 h2 a').text()
      const author = allLists.eq(i).find('div.book-info-1 span.font-color-990 a').eq(0).text()
      if (regex.test(name) || regex.test(author)) {
        const img = allLists.eq(i).find('div.book-img').children().eq(0).find('img').attr('src')
        const allPrices = allLists.eq(i).find('div.book-info-2 span.font-color01').length //區分折扣與價格
        let price
        let discount = 0
        if (allPrices > 1) {
          discount = allLists.eq(i).find('div.book-info-2 span.font-color01').eq(0).text()
          price = allLists.eq(i).find('div.book-info-2 span.font-color01').eq(1).text()
        }
        const stock = allLists.eq(i).find('div.book-info-2 div.button02').html() ? 1 : 0
        const productNumber = allLists.eq(i).find('div.book-info-1 a').attr('href').slice(9)
        const url = allLists.eq(i).find('div.book-info-1 div.padding-top-10px a').attr('href')
        const StoreId = 25
        const product = { name, img, price, discount, stock, author, productNumber, url, StoreId }
        books.push(product)
      }
    }
    return { books, pages }
  }
  catch (err) {
    throw err
  }
}