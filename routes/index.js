const home = require('./modules/home')
const book = require('./modules/book')

const authenticated = require('../middlewares/auth')

module.exports = (app) => {
  app.use('/', home)
  app.use(authenticated)
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated
    res.locals.user = req.user
    next()
  })
  app.use('/books', book)
}