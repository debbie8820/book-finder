const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) {
      return res.redirect('/signin')
    }
    if (err) {
      return next(err)
    }
    req.user = user.toJSON()
    next()
  })(req, res, next)
}

module.exports = authenticated