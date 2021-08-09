const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'Hotmail',
  auth: {
    user: process.env.hotmailName,
    pass: process.env.hotmailPass
  }
})


module.exports = function (message) {
  const options = {
    to: process.env.to,
    from: process.env.from,
    subject: process.env.subject,
    text: `資料庫發出的最新通知如下: ${message}`
  }
  transporter.sendMail(options, (err, info) => {
    if (err) {
      throw err
    }
    console.log(`email sent successfully!`, info)
  })
}