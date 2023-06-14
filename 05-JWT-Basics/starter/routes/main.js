const express = require('express')
const { login, dashboard } = require('../controllers/main')
const authentication = require('../middleware/auth')
const router = express.Router()

router.route('/dashboard').get(authentication,dashboard)
router.route('/login').post(login)

module.exports = router

