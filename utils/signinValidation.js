const { User } = require('../models')
const bcrypt = require('bcryptjs')

module.exports = async (email, password) => {
  const data = {}
  data.errors = []

  if (!email.trim() || !password.trim()) {
    data.errors.push({ message: 'Please fill in all the fields.' })
    return data
  }

  const user = await User.findOne({ where: { email } })
  if (!user) {
    data.errors.push({ message: 'This email is not registered.' })
    return data
  }

  const isMatch = bcrypt.compareSync(password, user.password)
  if (!isMatch) {
    data.errors.push({ message: 'Incorrect password' })
    return data
  }

  data.user = user

  return data
}