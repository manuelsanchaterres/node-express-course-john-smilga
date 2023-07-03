const express = require('express')
const router = express.Router()
const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview} = require('../controllers/reviewController')

const authenticateUser = require('../middleware/authentication')
const { checkPermissions } = require('../middleware/user-permissions')

router.route('/').post(authenticateUser, checkPermissions('user'), createReview).get(getAllReviews)
router.route('/:id').get(getSingleReview).patch(authenticateUser, checkPermissions('user'), updateReview).delete(authenticateUser, checkPermissions('user'), deleteReview)

module.exports = router