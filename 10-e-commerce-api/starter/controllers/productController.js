const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const { BadRequestError, NotFoundError} = require("../errors");
const { checkOwnership } = require("../utils/functions/checkOwnership");
const eventEmitter = require('../events/eventEmitter');

const createProduct = async (req,res) => {

    req.body.user = req.user.userId

    const product = await Product.create(req.body)

    if (!product) {

        throw new BadRequestError('Product not created')
    }

    eventEmitter.emit('ProductCreated', true)

    res.status(StatusCodes.CREATED).json({product})

}

const getAllProducts = async (req,res) => {

    const products = await Product.find({})

    if (!products) {

        throw new NotFoundError('Products not found')
    }

    res.status(StatusCodes.OK).json({products})
}

const getSingleProduct = async (req,res) => {

    const product = await Product.findOne({_id:req.params.id}).populate({path: 'reviews', select: 'rating title comment user'})

    if (!product) {

        throw new NotFoundError(`Product with id ${req.params.id} not found`)
    }

    res.status(StatusCodes.OK).json({product})

}

const updateProduct = async (req,res) => {

    let product = await Product.findById(req.params.id)

    if (!product) {

        throw new NotFoundError(`Product with id ${req.params.id} not found`)
    }

    checkOwnership({productUser: product.user, userId: req.user.userId} )

    await product.updateOne(
        req.body,
        {new: true, runValidators: true}
    )

    res.status(StatusCodes.OK).json({product})

}

const deleteProduct = async (req,res) => {

    let product = await Product.findById(req.params.id)

    if (!product) {

        throw new NotFoundError(`Product with id ${req.params.id} not found`)
    }

    checkOwnership({productUser: product.user, userId: req.user.userId} )

    await product.deleteOne()

    res.status(StatusCodes.OK).json({product})

}


module.exports = {
    createProduct, 
    getAllProducts, 
    getSingleProduct,
    updateProduct,
    deleteProduct,
}