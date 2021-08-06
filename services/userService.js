const { User } = require('../models')
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

  logout: () => {

  }
}

module.exports = userService