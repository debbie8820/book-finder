const exphbs = require('express-handlebars')
const express = require('express')
const { urlencoded } = require('express')
const cookieParser = require('cookie-parser')
const schedule = require('node-schedule')
const bookService = require('./services/bookService')

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const sendEmail = require('./config/sendEmail')
const passport = require('./config/passport')
const port = process.env.PORT || 3000
const app = express()

app.use(express.static('public/img'))
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')

app.use(passport.initialize())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const job = schedule.scheduleJob('0 0 10 * * *', async () => {
  try {
    const result = await bookService.updateBooks()

    if (result) {
      sendEmail('Database updated!')
    } else {
      sendEmail('Database did not update')
    }
  }
  catch (err) {
    console.log(err)
    sendEmail(`Database error: ${err}`)
  }
})

require('./routes')(app)

app.use((err, req, res, next) => {
  return res.status(500).json({ Error: String(err) })
})