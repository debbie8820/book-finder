const exphbs = require('express-handlebars')
const express = require('express')

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const port = process.env.PORT || 3000
const app = express()

app.use(express.static('public/img'))
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

require('./routes')(app)

app.use((err, req, res, next) => {
  return res.status(500).json({ Error: String(err) })
})