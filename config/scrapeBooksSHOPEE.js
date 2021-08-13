module.exports = async (URL, keyword) => {
  try {
    const books = []
    const SHOPEE_encoded = encodeURI(URL).replace('+', '%20')
    const SHOPEE_body = await require('../utils/getUrl')(SHOPEE_encoded)
    const SHOPEE$ = JSON.parse(SHOPEE_body).items
    if (!SHOPEE$.length) {
      return { books, pages: 0 }
    }

    let regex = new RegExp(keyword, 'i')
    if (keyword.split(' ').length > 1) {
      let regexGroup = ''
      const splitedKeywords = keyword.split(' ')
      for (let i = 0; i < splitedKeywords.length; i++) {
        regexGroup += `(?=.*${splitedKeywords[i]})`
      }
      regex = new RegExp(regexGroup, 'i')
    }


    const pages = Math.ceil(JSON.parse(SHOPEE_body).total_count / 60)

    for (let i = 0; i < SHOPEE$.length; i++) {
      const name = SHOPEE$[i].item_basic.name
      const author = SHOPEE$[i].item_basic.brand

      if (regex.test(name) || regex.test(author)) {
        const img = `https://cf.shopee.tw/file/${SHOPEE$[i].item_basic.image}`
        const price = SHOPEE$[i].item_basic.price / 100000
        let discount = SHOPEE$[i].item_basic.discount * 10
        if (discount.toString().length > 1 && discount.toString()[1] === '0') {
          discount = Number(discount.toString().slice(0, 1))
        }
        const stock = SHOPEE$[i].item_basic.stock

        const productNumber = `${SHOPEE$[i].item_basic.shopid}.${SHOPEE$[i].item_basic.itemid}`
        const url = `https://shopee.tw/${name}-i.${productNumber}`
        const StoreId = 15
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
