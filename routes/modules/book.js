const express = require('express')
const router = express.Router()
const bookController = require('../../controllers/bookController')

router.post('/:BookId/like', bookController.likeBooks)
router.post('/:BookId/unlike', bookController.unlikeBooks)

module.exports = router