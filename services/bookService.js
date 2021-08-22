const { Book, Store, Like, Keyword } = require('../models')
const { Op } = require('sequelize')
const PAGE_LIMIT = 20
const Sequelize = require('sequelize')
const scrapeBooksCITE = require('../config/scrapeBooksCITE')
const scrapeBooksBOOK = require('../config/scrapeBooksBOOK')
const scrapeBooksSHOPEE = require('../config/scrapeBooksSHOPEE')
const blueBirdPromise = require('bluebird')

const bookService = {
  storeKeyword: (keyword) => {
    Keyword.findOrCreate({ where: { keyword } })
  },

  searchBooks: async (keyword, pageNum, ordering, UserId) => {
    try {
      const keywords = keyword.split(' ')
      let matchQuery = [] //若關鍵字中有空格，則進行切割並交錯比對

      if (keyword.split(' ').length > 1) {
        keywords.push(keyword)
        matchQuery = Array.from({ length: keywords.length - 1 }).map((e, i) => ({
          name: { [Op.regexp]: `${keywords[i]}` }
        }))
      }

      let offset = 0
      const order = require('../config/order').order(ordering, keyword)
      if (pageNum) {
        offset = (Number(pageNum) - 1) * PAGE_LIMIT
      }

      const whereQuery = {
        [Op.or]: [
          { name: { [Op.like]: `%${keywords[keywords.length - 1]}%` } },
          { [Op.and]: matchQuery },
          { author: { [Op.like]: `%${keywords[keywords.length - 1]}%` } }
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
          [Sequelize.literal(`(SELECT DATE_FORMAT (Book.updatedAt, '%Y.%m.%d'))`), 'updatedAt'],
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

      // //博客來
      const booksBook = await scrapeBooksBOOK(`https://search.books.com.tw/search/query/cat/1/sort/1/v/0/page/1/spell/3/ms2/ms2_1/key/${keyword}`, keyword)

      if (booksBook.books.length) {
        result.push(...booksBook.books)
      }

      //蝦皮書城
      const booksShopee = await scrapeBooksSHOPEE(`https://shopee.tw/api/v4/search/search_items?by=relevancy&keyword=${keyword}&label_ids=1000075&limit=60&newest=0&order=desc&page_type=search&scenario=PAGE_MICROSITE_SEARCH&skip_ads=1&version=2`, keyword)
      const shopeePage = Number(booksShopee.pages)

      if (booksShopee.books.length) {
        result.push(...booksShopee.books)
      }

      if (shopeePage > 1) {
        const pageArray = Array.from({ length: shopeePage }).map((d, i) => { return i + 1 }).splice(1, shopeePage - 1)

        const shopeeResult = await blueBirdPromise.map(pageArray, (item) => {
          return scrapeBooksSHOPEE(`https://shopee.tw/api/v4/search/search_items?by=relevancy&keyword=${keyword}&label_ids=1000075&limit=60&newest=${(item - 1) * 60}&order=desc&page_type=search&scenario=PAGE_MICROSITE_SEARCH&skip_ads=1&version=2`, keyword)
        }, { concurrency: 1 })

        shopeeResult.map(e => {
          if (e.books.length) {
            result.push(...e.books)
          }
        })
      }

      //城邦書局
      const booksCite = await scrapeBooksCITE(`https://www.cite.com.tw/search_result?keywords=${keyword}`, keyword)
      const citePage = Number(booksCite.pages)

      if (booksCite.books.length) {
        result.push(...booksCite.books)
      }

      if (citePage > 1) {
        const pageArray = Array.from({ length: citePage }).map((d, i) => { return i + 1 }).splice(1, citePage - 1)

        const citeResult = await blueBirdPromise.map(pageArray, (item) => {
          return scrapeBooksCITE(`https://www.cite.com.tw/search_result?keywords=${keyword}&page=${item}`, keyword)
        }, { concurrency: 1 })

        citeResult.map(e => {
          if (e.books.length) {
            result.push(...e.books)
          }
        })
      }

      if (result.length) {
        await Book.bulkCreate(result, { updateOnDuplicate: ['name', 'img', 'price', 'discount', 'stock', 'author', 'url', 'StoreId', 'updatedAt'] })
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

      await blueBirdPromise.map(keywords, (item) => { return bookService.scrapeBooks(item.keyword) }, { concurrency: 1 })
      return true
    }
    catch (err) {
      throw err
    }
  }
}

module.exports = bookService

