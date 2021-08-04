const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')

router.get('/signup', (req, res, next) => { return res.render('signup') })

router.post('/signup', userController.signup)

router.get('/signin', (req, res, next) => { return res.render('signin') })

router.post('/signup', userController.signin)

router.get('/', (req, res, next) => { return res.render('index') })

module.exports = router