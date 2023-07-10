const express = require('express')

const router = express.Router()

const {getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder, deleteOrder} = require('../controllers/orderController')
const { checkPermissions } = require('../middleware/user-permissions')

router
.route('/')
.get(checkPermissions('admin'),getAllOrders)
.post(createOrder)

router
.route('/showAllMyOrders')
.get(getCurrentUserOrders)

router
.route('/:id')
.get(getSingleOrder)
.patch(updateOrder)
.delete(deleteOrder)


module.exports = router


