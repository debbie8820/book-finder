const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const { User, Book } = require('../models')
const passport = require('passport')

const ExtractFromCookie = (req) => {
  let token
  if (req && req.cookies) {
    token = req.cookies.token
  }
  return token
}

const options = {
  jwtFromRequest: ExtractFromCookie,
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.id, {
      include: [
        { model: Book, as: 'LikedBooks', attributes: ['id'] }
      ]
    })
    if (user) {
      return done(null, user)
    }
    return done(null, false)
  }
  catch (err) {
    return done(err, false)
  }
}))

module.exports = passport