const express = require('express')
const router = express.Router()
const {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword} = require('../controllers/userController')
const { checkPermissions } = require('../middleware/user-permissions')

router.route('/').get(checkPermissions('admin'), getAllUsers)
router.route('/showMe').get(showCurrentUser)
router.route('/updateUserPassword').patch(updateUserPassword)
router.route('/updateUser').patch(updateUser)
router.route('/:id').get(checkPermissions('admin', 'user'), getSingleUser)

module.exports = router