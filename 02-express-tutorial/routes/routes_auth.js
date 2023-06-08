const express = require('express')
const { loginUser } = require('../controllers/controller_auth')
const router = express.Router()

// router.post('/', loginUser)


router.route('/').post(loginUser)

module.exports = router
  