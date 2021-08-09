const cheerio = require('cheerio')

module.exports = async (URL) => {
  try {
    const books = []
    const SHOPEE_encoded = encodeURI(URL)
    const SHOPEE_body = await require('../utils/getUrl')(SHOPEE_encoded)
    const SHOPEE$ = JSON.parse(SHOPEE_body).items
    const pages = Math.ceil(JSON.parse(SHOPEE_body).total_count / 60)

    for (let i = 0; i < SHOPEE$.length; i++) {
      const name = SHOPEE$[i].item_basic.name
      const img = `https://cf.shopee.tw/file/${SHOPEE$[i].item_basic.image}`
      const price = SHOPEE$[i].item_basic.price / 100000
      const discount = SHOPEE$[i].item_basic.discount * 10
      const stock = SHOPEE$[i].item_basic.stock
      const author = SHOPEE$[i].item_basic.brand
      const productNumber = `${SHOPEE$[i].item_basic.shopid}.${SHOPEE$[i].item_basic.itemid}`
      const url = `https://shopee.tw/${name}-i.${productNumber}`
      const StoreId = 15
      const product = { name, img, price, discount, stock, author, productNumber, url, StoreId }
      books.push(product)
    }
    return { books, pages }
  }
  catch (err) {
    throw err
  }
}