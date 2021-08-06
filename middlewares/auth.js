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

const setResLocals = (req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.user = req.user
  next()
}

module.exports = { authenticated, setResLocals }