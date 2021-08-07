const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')

router.get('/signup', userController.getSignupPage)

router.post('/signup', userController.signup)

router.get('/signin', userController.getSigninPage)

router.post('/signin', userController.signin)

router.post('/logout', userController.logout)

router.get('/', userController.getHomePage)

module.exports = router