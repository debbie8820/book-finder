const bookService = require('../services/bookService')

const bookController = {
  searchBooks: async (req, res, next) => {
    try {
      const data = await bookService.searchBooks(req.query.keyword, req.query.pageNum, req.query.order)

      if (!data.rows.length) {
        console.log('查無此書！')
      }
      return res.render('books', { books: data.rows, keyword: data.keyword, order: data.ordering, page: data.page, pages: data.pages, totalPages: data.totalPages, pre: data.pre, next: data.next })
    }
    catch (err) {
      return next(err)
    }
  }
}

module.exports = bookController