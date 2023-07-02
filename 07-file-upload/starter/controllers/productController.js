const { StatusCodes } = require("http-status-codes");
const {NotFoundError} = require("../errors");
const Product = require("../models/Product");
const eventEmitter = require('../events/eventEmitter');

const getAllProducts = async (req,res) => {

    const products = await Product.find({})

    if (!products) {

        throw new NotFoundError('products not found')

    }

    res.status(StatusCodes.OK).json({products})

}

const getSingleProduct = async (req,res) => {

    const product = await Product.findById(req.params.id)

    if (!product) {

        throw new NotFoundError(`Product with id ${req.params.id} was not found`)

    }

    res.status(StatusCodes.CREATED).json({product})

}

const createProduct = async (req,res) => {

    const product = await Product.create(req.body)

    if (!product) {

        throw new NotFoundError('product was not created')

    }

    eventEmitter.emit('productCreated')
    
    res.status(StatusCodes.CREATED).json({product})

}

const updateProduct = async (req,res) => {

    const product = await Product.findOneAndUpdate(
        {_id: req.params.id}, 
        req.body, 
        {new:true, runValidators: true}
    )

    if (!product) {

        throw new NotFoundError('product was not updated')

    }

    res.status(StatusCodes.CREATED).json({product})

}

const deleteProduct = async (req,res) => {

    const product = await Product.findOneAndDelete({_id: req.params.id})

    if (!product) {

        throw new NotFoundError('product was not deleted')

    }

    res.status(StatusCodes.CREATED).json({product})

}

module.exports = {getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct}