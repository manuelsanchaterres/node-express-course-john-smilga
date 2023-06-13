const express = require('express')
const router = express.Router()

const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/controller_products')

router.route('/').get(getProducts).post(createProduct)
router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct)

module.exports = router