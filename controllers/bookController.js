const bookService = require('../services/bookService')

const bookController = {
  searchBooks: async (req, res, next) => {
    try {
      const data = await bookService.searchBooks(req.query.keyword, req.query.page)
      if (!data.rows.length) {
        console.log('查無此書！')
      }
      return res.send(data)
    }
    catch (err) {
      return next(err)
    }
  }
}

module.exports = bookController