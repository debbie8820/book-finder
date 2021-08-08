const home = require('./modules/home')
const book = require('./modules/book')
const user = require('./modules/user')

const { authenticated, easyAuthenticated, setResLocals } = require('../middlewares/auth')

const bookController = require('../controllers/bookController')

module.exports = (app) => {
  app.use('/', easyAuthenticated, setResLocals, home)
  app.use('/users', authenticated, setResLocals, user)
  app.use('/books', authenticated, setResLocals, book)
  app.use('/searchBooks', easyAuthenticated, setResLocals, bookController.storeKeyword, bookController.searchBooks)
}