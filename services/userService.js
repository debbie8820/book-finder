const { User } = require('../models')

const userService = {
  signup: (data) => {
    User.create({ ...data })
  },

  signin: () => {

  },

  logout: () => {

  }
}

module.exports = userService