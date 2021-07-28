const exphbs = require('express-handlebars')
const express = require('express')

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const port = process.env.PORT || 3000
const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

require('./routes')(app)

app.use((err, req, res) => {
  return res.status(500).json({ Error: String(err) })
})