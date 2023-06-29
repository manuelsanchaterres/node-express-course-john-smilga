const {
    createProduct, 
    getAllProducts, 
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController')

const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const { checkPermissions } = require('../middleware/user-permissions')

router
.route('/')
.get(getAllProducts)
.post(authenticateUser,checkPermissions('admin'),createProduct)

router
.route('/uploadImage')
.post(authenticateUser,checkPermissions('admin'),uploadImage)

router
.route('/:id')
.get(getSingleProduct)
.patch(authenticateUser,checkPermissions('admin'),updateProduct)
.delete(authenticateUser,checkPermissions('admin'),deleteProduct)


module.exports = router


