const bookService = require('../services/bookService')

const bookController = {
  storeKeyword: (req, res, next) => {
    if (!req.query.keyword.trim()) {
      const errors = [{ message: `請輸入關鍵字` }]
      return res.render('books', { errors })
    }
    bookService.storeKeyword(req.query.keyword)
    next()
  },

  searchBooks: async (req, res, next) => {
    try {
      const UserId = req.user ? req.user.id : 0
      const data = await bookService.searchBooks(req.query.keyword, req.query.pageNum, req.query.order, UserId)

      if (!data.rows.length) {
        const errors = [{ message: `抱歉，找不到您所查詢${req.query.keyword}的相關資料` }]
        return res.render('books', { errors })
      }

      return res.render('books', { books: data.rows, keyword: data.keyword, order: data.ordering, page: data.page, pages: data.pages, totalPages: data.totalPages, pre: data.pre, next: data.next })
    }
    catch (err) {
      next(err)
    }
  },

  likeBooks: async (req, res, next) => {
    try {
      await bookService.likeBooks(req.user.id, req.params.BookId)
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },

  unlikeBooks: async (req, res, next) => {
    try {
      await bookService.unlikeBooks(req.user.id, req.params.BookId)
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = bookController