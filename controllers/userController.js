const userService = require('../services/userService')
const bcrypt = require('bcryptjs')

const userController = {
  getHomePage: (req, res, next) => {
    return res.render('index')
  },

  getSignupPage: (req, res, next) => {
    return res.render('signup')
  },

  signup: async (req, res, next) => {
    try {
      const { name, email, password, birthday, gender } = req.body
      const errors = await require('../utils/signupValidation')(req.body)
      if (errors.length) {
        return res.render('signup', { errors, name, email, password, birthday, gender })
      }

      const hash = bcrypt.hashSync(password, 10)
      await userService.signup({ name, email, password: hash, birthday, gender })
      return res.redirect('/signin')
    }
    catch (err) {
      next(err)
    }
  },

  getSigninPage: (req, res, next) => {
    return res.render('signin', { referer: req.headers.referer })
  },

  signin: async (req, res, next) => {
    try {
      const { email, password, referer } = req.body

      const data = await require('../utils/signinValidation')(email, password)
      if (data.errors.length) {
        return res.render('signin', { errors: data.errors, email, password, referer })
      }

      const token = await userService.signin(data.user)

      res.cookie('token', token, { maxAge: 86400000, httpOnly: true, secure: true })

      if (referer && referer !== 'undefined' && referer.slice(-7) !== '/signin' && referer.slice(-7) !== '/signup') {
        return res.redirect(referer)
      }
      return res.redirect('/')
    }
    catch (err) {
      next(err)
    }
  },

  logout: (req, res, next) => {
    res.clearCookie('token')
    return res.redirect('/')
  },

  getLikedBooks: async (req, res, next) => {
    try {
      const bookIds = req.user.LikedBooks.map((e) => { return e.id })
      const likedBooks = await userService.getLikedBooks(bookIds, req.query.pageNum)
      return res.render('like', { books: likedBooks.rows, pages: likedBooks.pages, pages: likedBooks.pages, totalPages: likedBooks.totalPages, pre: likedBooks.pre, next: likedBooks.next })
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = userController