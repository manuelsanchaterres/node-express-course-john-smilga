const express = require('express')
const router = express.Router()

const{
    getAllProducts, 
    getSingleProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct} 
    = require('../controllers/productController')

const {uploadProductImageLocal, uploadProductImage} = require('../controllers/uploadsController')

router.route('/').get(getAllProducts).post(createProduct)
router.route('/uploads').post(uploadProductImage)

router.route('/:id').get(getSingleProduct).patch(updateProduct).delete(deleteProduct)


module.exports = router