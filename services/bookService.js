const cheerio = require('cheerio')
const { Book, Store, Like } = require('../models')
const { Op } = require('sequelize')
const PAGE_LIMIT = 20
const Sequelize = require('sequelize')


const bookService = {
  searchBooks: async (keyword, pageNum, ordering, UserId) => { //查找資料庫
    try {
      let offset = 0
      const order = require('../config/order').order(ordering)
      if (pageNum) {
        offset = (Number(pageNum) - 1) * PAGE_LIMIT
      }

      const whereQuery = {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { author: { [Op.like]: `%${keyword}%` } }
        ]
      }

      const books = await Book.findAndCountAll({
        include: [{ model: Store }],
        where: whereQuery,
        offset,
        limit: PAGE_LIMIT,
        order,
        raw: true,
        nest: true,
        attributes: ['name', 'url', 'img', 'author', 'stock', 'StoreId', 'discount', 'price', 'author', 'id',
          [Sequelize.literal(`(SELECT EXISTS (SELECT * FROM Likes WHERE UserId = ${UserId} AND BookId = Book.id))`), 'isLiked']
        ]
      })

      const page = Number(pageNum) || 1
      const pages = Math.ceil(books.count / PAGE_LIMIT)
      const totalPages = Array.from({ length: pages }).map((d, i) => {
        return i + 1
      })
      const pre = page - 1 > 1 ? page - 1 : 1
      const next = page + 1 < pages ? page + 1 : pages

      if (books.rows.length) {
        const result = Object.assign(books, { keyword, ordering, page, pages, totalPages, pre, next })
        return result
      }

      const result = await bookService.scrapeBooks(keyword, ordering)
      return result
    }
    catch (err) {
      throw err
    }
  },

  scrapeBooks: async (keyword, ordering) => { //爬蟲
    try {
      let result = []

      //博客來
      const BOOK_ORDER = require('../config/order').BOOK_ORDER(ordering)
      const BOOK_URL = `https://search.books.com.tw/search/query/cat/${BOOK_ORDER}/sort/1/v/0/page/1/spell/3/ms2/ms2_1/key/${keyword}`
      const BOOK_encoded = encodeURI(BOOK_URL)
      const BOOK_body = await require('../utils/getUrl')(BOOK_encoded)
      const BOOK$ = cheerio.load(BOOK_body)
      const allTbodies = BOOK$(".table-searchlist tbody")

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
          result.push(product)
        }
      }


      //蝦皮書城
      const SHOPEE_ORDER = require('../config/order').SHOPEE_ORDER(ordering)
      const SHOPEE_URL = `https://shopee.tw/api/v4/search/search_items?by=${SHOPEE_ORDER[0]}&keyword=${keyword}&label_ids=1000075&limit=60&newest=0&order=${SHOPEE_ORDER[1]}&page_type=search&scenario=PAGE_MICROSITE_SEARCH&skip_ads=1&version=2`
      const SHOPEE_encoded = encodeURI(SHOPEE_URL)
      const SHOPEE_body = await require('../utils/getUrl')(SHOPEE_encoded)
      const SHOPEE$ = JSON.parse(SHOPEE_body).items

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
        result.push(product)
      }

      //城邦書店
      const CITE_ORDER = require('../config/order').CITE_ORDER(ordering)
      const CITE_URL = `https://www.cite.com.tw/search_result?keywords=${keyword}&sort=${CITE_ORDER}`
      const CITE_encoded = encodeURI(CITE_URL)
      const CITE_body = await require('../utils/getUrl')(CITE_encoded)
      const CITE$ = cheerio.load(CITE_body)
      const allLists = CITE$('.book-container li.book-area-1')

      for (let i = 0; i < allLists.length; i++) {
        const name = allLists.eq(i).find('div.book-info-1 h2 a').text()
        const regex = new RegExp(keyword, 'i') //嚴格搜尋
        if (name.match(regex)) {
          const img = allLists.eq(i).find('div.book-img').children().eq(0).find('img').attr('src')
          const allPrices = allLists.eq(i).find('div.book-info-2 span.font-color01').length //區分折扣與價格
          let price
          let discount = 0
          if (allPrices > 1) {
            discount = allLists.eq(i).find('div.book-info-2 span.font-color01').eq(0).text()
            price = allLists.eq(i).find('div.book-info-2 span.font-color01').eq(1).text()
          }
          const author = allLists.eq(i).find('div.book-info-1 span.font-color-990 a').eq(0).text()
          const stock = allLists.eq(i).find('div.book-info-2 div.button02').html() ? 1 : 0
          const productNumber = allLists.eq(i).find('div.book-info-1 a').attr('href').slice(9)
          const url = allLists.eq(i).find('div.book-info-1 div.padding-top-10px a').attr('href')
          const StoreId = 25
          const product = { name, img, price, discount, stock, author, productNumber, url, StoreId }
          result.push(product)
        }

      }

      Book.bulkCreate(result, { updateOnDuplicate: ['discount', 'price'] })

      const page = 1
      const pages = Math.ceil(result.length / PAGE_LIMIT)
      const totalPages = Array.from({ length: pages }).map((d, i) => { return i + 1 })
      const pre = 1
      const next = page + 1 > pages ? pages : page + 1
      if (pages > 1) {
        result = result.slice(0, 20)
      }
      const books = Object.assign({ rows: result }, { keyword, ordering, page, pages, totalPages, pre, next })
      return books
    }
    catch (err) {
      throw err
    }
  },

  likeBooks: async (UserId, BookId) => {
    await Like.findOrCreate({ where: { UserId, BookId } })
  },

  unlikeBooks: async (UserId, BookId) => {
    const like = await Like.findOne({ where: { UserId, BookId } })
    if (like) {
      await like.destroy()
    }
  }
}

module.exports = bookService