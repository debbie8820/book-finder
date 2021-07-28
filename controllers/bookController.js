const bookService = require('../services/bookService')

const bookController = {
  searchBooks: async (req, res, next) => {
    try {
      const data = await bookService.searchBooks(req.query.keyword)
      console.log(data)
    }
    catch (err) {
      return next(err)
    }
  }
}

module.exports = bookController