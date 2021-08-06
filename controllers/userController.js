const userService = require('../services/userService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userController = {
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

  signin: async (req, res, next) => {
    try {
      const { email, password } = req.body

      const data = await require('../utils/signinValidation')(email, password)
      if (data.errors.length) {
        return res.render('signin', { errors, email, password })
      }

      const token = await userService.signin(data.user)

      res.cookie('token', token, { maxAge: 86400000, httpOnly: true, secure: true })
      return res.redirect('/')
    }
    catch (err) {
      next(err)
    }
  },

  logout: (req, res, next) => {

  }
}

module.exports = userController