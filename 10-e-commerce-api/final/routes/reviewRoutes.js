const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

router.route('/').post(authenticateUser,authorizePermissions('user'), createReview).get(getAllReviews);

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser,authorizePermissions('user'),  updateReview)
  .delete(authenticateUser,authorizePermissions('user'),  deleteReview);

module.exports = router;
