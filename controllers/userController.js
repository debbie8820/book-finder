const userService = require('../services/userService')
const bcrypt = require('bcryptjs')

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

  signin: (req, res, next) => {

  },

  logout: (req, res, next) => {

  }
}

module.exports = userController