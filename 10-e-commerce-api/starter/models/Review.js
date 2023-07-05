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

ReviewSchema.statics.calculateAverageRating = async function(productId) {

    const result = await this.aggregate([

        {$match:{product: productId}},
        {$group: {
            _id: null,
            averageRating: {$avg: '$rating'},
            numberOfReviews: {$sum:1}
        }}
    ])

    try {

        await this.model('Product').findOneAndUpdate({_id:productId}, {

        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numberOfReviews: result[0]?.numberOfReviews || 0,

       })

    } catch (error) {
        
        console.log(error);
    }
}

ReviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product)

})

// ReviewSchema.post('remove', async function () {

//     await this.constructor.calculateAverageRating(this.product)
// })

module.exports = mongoose.model('Review', ReviewSchema);