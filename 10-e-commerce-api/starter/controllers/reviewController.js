const Review = require("../models/Review");
const CustomError = require('../errors');
const { StatusCodes } = require("http-status-codes");


const createReview = async(req,res) => {

    req.body.product = req.params.productId
    req.body.user = req.user.userId

    if (!req.params.productId) {

        throw new CustomError.NotFoundError('Product Id Not Provided')
    }

    const review = await Review.create(req.body)

    if (!review) {

        throw new CustomError.BadRequestError('Product Review Not Created')
    }


    res.status(StatusCodes.CREATED).json({review})

}

const getAllReviews = async(req,res) => {

    if (!req.params.productId) {

        throw new CustomError.NotFoundError('Product Id Not Provided')
    }

    const reviews = await Review.find({product: req.params.productId})

    if (!reviews) {

        throw new CustomError.NotFoundError(`Product Reviews for Product ${req.params.productId} Not Found`)

    }

    res.status(StatusCodes.OK).json({reviews})
    
}

const getSingleReview = async(req,res) => {

   const {productId, reviewId} = req.params

   if (!reviewId) {

    throw new CustomError.NotFoundError('reviewId Not Provided')

   }
    
    const review = await Review.findOne({product: productId, _id:reviewId})

    if (!review) {

        throw new CustomError.NotFoundError(`Review with id ${reviewId} was not found`)
    }


    res.status(StatusCodes.OK).json({review})
    
}

const updateReview = async(req,res) => {

    const {productId, reviewId} = req.params

    if (!productId || !reviewId) {
 
     throw new CustomError.NotFoundError('productId and/or reviewId Not Provided')
 
    }
     
    const review = await Review.findOneAndUpdate({product: productId, _id:reviewId, user: req.user.userId}, req.body, {new: true, runValidators: true})

    if (!review) {

        throw new CustomError.NotFoundError(`Review with id ${reviewId} was not updated`)
    }

    res.status(StatusCodes.OK).json({review})
     
}

const deleteReview = async(req,res) => {

    const {productId, reviewId} = req.params

    if (!productId || !reviewId) {
 
        throw new CustomError.NotFoundError('productId and/or reviewId Not Provided')
    
    }
        
    const review = await Review.findOneAndDelete({product: productId, _id:reviewId, user: req.user.userId}, req.body, {new: true, runValidators: true})

    if (!review) {

        throw new CustomError.NotFoundError(`Review with id ${reviewId} was not deleted`)
    }

    res.status(StatusCodes.OK).json({review})
    
}

module.exports = {createReview, getAllReviews, getSingleReview, updateReview, deleteReview}