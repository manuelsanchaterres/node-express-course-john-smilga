const Order = require("../models/Order");
const CustomError = require('../errors');
const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const { checkOwnership } = require("../utils/functions/checkOwnership");

const fakeStripeAPI = async({amount, currency}) => {

    const clientSecret = 'someRandomValue'

    return {clientSecret, amount}
}

const getAllOrders = async(req,res) => {

   const orders = await Order.find({})

   if (!orders) {

    throw new CustomError.NotFoundError(`Orders not Found`)

   }

   res.status(StatusCodes.OK).json({orders})
}

const getSingleOrder = async(req,res) => {

    const {id} = req.params

    const order = await Order.findById(id)

    if (!order) {

        throw new CustomError.NotFoundError(`Order with id ${id} not Found`)
    
    }

    checkOwnership(req.user, order.user)
    
    res.status(StatusCodes.OK).json({order})

}

const getCurrentUserOrders = async(req,res) => {

    const orders = await Order.find({user: req.user.userId})

    if (!orders) {
 
     throw new CustomError.NotFoundError(`Orders not Found`)
 
    }

   res.status(StatusCodes.OK).json({orders})
}

const createOrder = async(req,res) => {

    const{items: cartItems, tax, shippingFee} = req.body;

    if (!cartItems || cartItems.length < 1) {

        throw new CustomError.BadRequestError('No cart items provided')

    }

    if (!tax || !shippingFee) {

        throw new CustomError.BadRequestError('Please provide tax and shipping fee')

    }

    let orderItems = []
    let subtotal = 0;

    for (const item of cartItems) {

        const dbProduct = await Product.findOne({_id: item.product})

        if (!dbProduct) {

            throw new CustomError.NotFoundError(`Product with id ${item.product} not found`)

        }

        const {name, price, image, _id} = dbProduct
        
        const singleOrderItem = {

            amount : item.amount,
            name, 
            price, 
            image, 
            product: _id
        };

        // add item to order

        orderItems = [...orderItems, singleOrderItem]

        // calculate subtotal

        subtotal += (item.amount * price)

    }

    // calculate total order amount

    const total = tax + shippingFee + subtotal

    // get client secret

    const paymentIntent = await fakeStripeAPI( {

        amount: total,
        currency: 'usd'
    })

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.clientSecret,
        user: req.user.userId
    })

    res.status(StatusCodes.CREATED).json({order, clientSecret:order.clientSecret})
}

const updateOrder = async(req,res) => {

    const {id} = req.params

    const {paymentIntentId, status} = req.body

    const order = await Order.findById(id)

    if (!order) {

        throw new CustomError.NotFoundError(`Order with id ${id} not Found`)
    
    }

    checkOwnership(req.user, order.user)

    order.paymentIntentId = paymentIntentId
    order.status = 'paid'

    await order.save()

    res.status(StatusCodes.OK).json({order})

}

const deleteOrder = async(req,res) => {

    res.send('deleteOrder')
}

module.exports = {getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder, deleteOrder}