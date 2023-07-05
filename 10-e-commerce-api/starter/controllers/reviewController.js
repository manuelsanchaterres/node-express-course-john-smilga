const Review = require("../models/Review");
const CustomError = require('../errors');
const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const { checkOwnership } = require("../utils/functions/checkOwnership");

const createReview = async(req,res) => {

    req.body.product = req.params.productId
    req.body.user = req.user.userId

    if (!req.params.productId) {

        throw new CustomError.NotFoundError('Product Id Not Provided')
    }

    const isReviewSent = await Review.findOne({product:req.params.productId, user: req.user.userId})

    if (isReviewSent) {

        throw new CustomError.BadRequestError(`Previous Review for product ${req.params.productId} already sent`)

    }

    const review = await Review.create(req.body)

    if (!review) {

        throw new CustomError.BadRequestError('Product Review Not Created')
    }


    res.status(StatusCodes.CREATED).json({review})

}

const getAllReviews = async(req,res) => {

    const reviews = await Review
    .find({})
    .populate({path: 'product', select: 'name company price'})
    .populate({path: 'user', select: 'name'})

    if (!reviews) {

        throw new CustomError.NotFoundError(`Product Reviews for Product ${req.params.productId} Not Found`)

    }

    res.status(StatusCodes.OK).json({reviews, count: reviews.length})
    
}

const getSingleReview = async(req,res) => {

   const {productId, reviewId} = req.params

   if (!reviewId) {

    throw new CustomError.NotFoundError('reviewId Not Provided')

   }
    
    const review = await Review
    .findOne({product: productId, _id:reviewId})
    .populate({path: 'product', select: 'name company price -_id'})
    .populate({path: 'user', select: 'name -_id'})


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
     
    const review = await Review.findOne({product: productId, _id:reviewId})

    if (!review) {

        throw new CustomError.NotFoundError(`Review with id ${reviewId} was not deleted`)
    }

    checkOwnership(req.user, review.user)

    review.rating = req.body.rating
    review.title = req.body.title
    review.comment = req.body.comment
    console.log(review);

    review.save()

    res.status(StatusCodes.OK).json({review})
     
}

const deleteReview = async(req,res) => {

    const {productId, reviewId} = req.params

    if (!productId || !reviewId) {
 
        throw new CustomError.NotFoundError('productId and/or reviewId Not Provided')
    
    }
        
    const review = await Review.findOne({product: productId, _id:reviewId})

    if (!review) {

        throw new CustomError.NotFoundError(`Review with id ${reviewId} was not deleted`)
    }

    checkOwnership(req.user, review.user)

    await review.deleteOne()
    await Review.calculateAverageRating(review.product)

    res.status(StatusCodes.OK).json({msg: 'Success!: Review removed'})
    
}

const getSingleProductReviews = async(req,res) => {

    const {id: productId} = req.params

    const reviews = await Review.find({product: productId})
    res.status(StatusCodes.OK).json({reviews, count: reviews.length})
}


module.exports = {createReview, getAllReviews, getSingleReview, updateReview, deleteReview, getSingleProductReviews}