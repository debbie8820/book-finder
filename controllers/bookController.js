const bookService = require('../services/bookService')

const bookController = {
  searchBooks: async (req, res, next) => {
    try {
      const UserId = req.user ? req.user.id : 0
      const data = await bookService.searchBooks(req.query.keyword, req.query.pageNum, req.query.order, UserId)

      if (!data.rows.length) {
        console.log('查無此書！')
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