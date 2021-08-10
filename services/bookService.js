const { Book, Store, Like, Keyword } = require('../models')
const { Op } = require('sequelize')
const PAGE_LIMIT = 20
const Sequelize = require('sequelize')
const scrapeBooksCITE = require('../config/scrapeBooksCITE')
const scrapeBooksBOOK = require('../config/scrapeBooksBOOK')
const scrapeBooksSHOPEE = require('../config/scrapeBooksSHOPEE')

const bookService = {
  storeKeyword: (keyword) => {
    Keyword.findOrCreate({ where: { keyword } })
  },

  searchBooks: async (keyword, pageNum, ordering, UserId) => {
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

      const { page, pages, totalPages, pre, next } = require('../utils/pagination')(PAGE_LIMIT, books.count, pageNum)

      if (books.rows.length) {
        const result = Object.assign(books, { keyword, ordering, page, pages, totalPages, pre, next })
        return result
      }

      const bookExists = await bookService.scrapeBooks(keyword)

      if (bookExists) {
        return bookService.searchBooks(keyword, pageNum, ordering, UserId)
      }
      return books
    }
    catch (err) {
      throw err
    }
  },

  scrapeBooks: async (keyword) => {
    try {
      const result = []
      const promises = []

      // //博客來
      const booksBook = await scrapeBooksBOOK(`https://search.books.com.tw/search/query/cat/1/sort/1/v/0/page/1/spell/3/ms2/ms2_1/key/${keyword}`, keyword)

      if (booksBook.books.length) {
        result.push(...booksBook.books)
      }

      //蝦皮書城
      const booksShopee = await scrapeBooksSHOPEE(`https://shopee.tw/api/v4/search/search_items?by=relevancy&keyword=${keyword}&label_ids=1000075&limit=60&newest=0&order=desc&page_type=search&scenario=PAGE_MICROSITE_SEARCH&skip_ads=1&version=2`)

      if (booksShopee.books.length) {
        result.push(...booksShopee.books)
      }

      if (Number(booksShopee.pages) > 1) {
        for (let i = 2; i < Number(booksShopee.pages) + 1; i++) {
          const offset = (i - 1) * 60
          promises.push(scrapeBooksSHOPEE(`https://shopee.tw/api/v4/search/search_items?by=relevancy&keyword=${keyword}&label_ids=1000075&limit=60&newest=${offset}&order=desc&page_type=search&scenario=PAGE_MICROSITE_SEARCH&skip_ads=1&version=2`))
        }
      }

      //城邦書局
      const booksCite = await scrapeBooksCITE(`https://www.cite.com.tw/search_result?keywords=${keyword}`, keyword)

      if (booksCite.books.length) {
        result.push(...booksCite.books)
      }

      if (Number(booksCite.pages) > 1) {
        for (let i = 2; i < Number(booksCite.pages) + 1; i++) {
          promises.push(scrapeBooksCITE(`https://www.cite.com.tw/search_result?keywords=${keyword}&page=${i}`, keyword))
        }
      }

      const values = await Promise.all(promises)
      values.map((e) => {
        result.push(...e.books)
      })
      console.log('RESULT', result)
      if (result.length) {
        await Book.bulkCreate(result, { updateOnDuplicate: ['discount', 'price'] })
        return true
      }

      return false
    }
    catch (err) {
      throw err
    }
  },

  likeBooks: async (UserId, BookId) => {
    try {
      await Like.findOrCreate({ where: { UserId, BookId } })
    }
    catch (err) {
      throw err
    }
  },

  unlikeBooks: async (UserId, BookId) => {
    try {
      const like = await Like.findOne({ where: { UserId, BookId } })
      if (like) {
        await like.destroy()
      }
    }
    catch (err) {
      throw err
    }
  },

  updateBooks: async () => {
    try {
      const keywords = await Keyword.findAll({
        attributes: ['keyword'],
        raw: true
      })

      let promises = []
      for (let i = 0; i < keywords.length; i++) {
        promises.push(bookService.scrapeBooks(keywords[i]))
      }
      await Promise.all(promises)
      return true
    }
    catch (err) {
      throw err
    }
  }
}

module.exports = bookService