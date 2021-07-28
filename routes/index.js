const home = require('./modules/home')
const book = require('./modules/book')


module.exports = (app) => {
  app.use('/books', book)
  app.use('/', home)
}