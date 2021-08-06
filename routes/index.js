const home = require('./modules/home')
const book = require('./modules/book')

const { authenticated, setResLocals } = require('../middlewares/auth')

module.exports = (app) => {
  app.use('/', home)
  app.use('/books', authenticated, setResLocals, book)
}