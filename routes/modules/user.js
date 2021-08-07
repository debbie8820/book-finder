const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')

router.get('/likes', userController.getLikedBooks)

module.exports = router