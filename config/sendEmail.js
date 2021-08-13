const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'Hotmail',
  auth: {
    user: process.env.hotmailEmail,
    pass: process.env.hotmailPassword
  }
})


module.exports = function (message) {
  const options = {
    to: process.env.nodemailer_send_to,
    from: process.env.nodemailer_send_from,
    subject: process.env.nodemailer_subject,
    text: `資料庫發出的最新通知如下: ${message}`
  }
  transporter.sendMail(options, (err, info) => {
    if (err) {
      throw err
    }
    console.log(`email sent successfully!`, info)
  })
}