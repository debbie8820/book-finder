const { User, Book, Store } = require('../models')
const jwt = require('jsonwebtoken')

const userService = {
  signup: (data) => {
    User.create({ ...data })
  },

  signin: (user) => {
    const token = jwt.sign({
      id: user.id
    }, process.env.JWT_SECRET, {
      expiresIn: 86400000
    })
    return token
  },

  getLikedBooks: async (bookIds, pageNum) => {
    try {
      let offset = 0
      let PAGE_LIMIT = 20

      if (pageNum) {
        offset = (pageNum - 1) * PAGE_LIMIT
      }

      const books = await Book.findAndCountAll({
        offset,
        limit: PAGE_LIMIT,
        include: Store,
        where: { id: bookIds },
        raw: true
      })

      const { page, pages, totalPages, pre, next } = require('../utils/pagination')(PAGE_LIMIT, books.count, pageNum)

      Object.assign(books, { page, pages, totalPages, pre, next })
      return books
    }
    catch (err) {
      return err
    }
  }
}

module.exports = userService