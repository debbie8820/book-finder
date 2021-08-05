const { User } = require('../models')

module.exports = async (signupForm) => {
  const errors = []
  const { name, email, password, confirmPassword, birthday, gender } = signupForm
  if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !birthday.trim() || !gender.trim()) {
    errors.push({ message: 'Please fill in all the fields.' })
  }

  if (name.length > 15) {
    errors.push({ message: 'The maximum length of names is 15 characters.' })
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push({ message: 'Invalid email' })
  }

  const emailExists = await User.findOne({ where: { email } })
  if (emailExists) {
    errors.push({ message: 'The email has already been registered.' })
  }

  if (password !== confirmPassword) {
    errors.push({ message: 'Password and confirmation password do not match.' })
  }

  return errors
}