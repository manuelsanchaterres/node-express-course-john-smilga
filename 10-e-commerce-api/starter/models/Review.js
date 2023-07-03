const mongoose = require('mongoose')
const CustomError = require('../errors')

const ReviewSchema = new mongoose.Schema({

    rating: {

        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating'],

    },

    title: {

        type: String,
        required: [true, 'Please provide review title'],
        maxLength: 100
    },

    comment: {

        type: String,
        required: [true, 'Please provide review comment'],
    },

    user: {

        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },

    product: {

        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Please provide product'],
    }

},
{timestamps: true}
)

// index to only allow one comment per user and product

ReviewSchema.index({product: 1, user: 1}, {unique: true})

// ReviewSchema.pre('save', async function () {

//     const noUniqueReview = await this.schema.countDocuments({user: this.user, product: this.product}) > 1

//     if (noUniqueReview) {

//         throw new CustomError.BadRequestError('Only one comment per user and product permitted')
//     }

// });


module.exports = mongoose.model('Review', ReviewSchema)