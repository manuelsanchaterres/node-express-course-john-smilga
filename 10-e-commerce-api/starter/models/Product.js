const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({

    name: {

        type: String,
        required: [true, ' Please Provide Product Name'],
        trim: true,
        maxLength: [100, 'Name can not be more than 100 characters']
    },
    price: {

        type: Number,
        required: [true, ' Please Provide Product Price'],
        default: 0,
    },
    description: {

        type: String,
        required: [true, ' Please Provide Product Description'],
        maxLength: [1000, 'Description can not be more than 1000 characters']

    },
    image: {

        type: String,
        default: "/uploads/example.jpeg"
    },
    category: {

        type: String,
        required: [true, ' Please Provide Product Category'],
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {

        type: String,
        required: [true, ' Please Provide Product Company'],
        enum: {
            
            values:['ikea', 'liddy', 'marcos'],
            message: '{VALUE} is not supported'
        },
    },

    colors: {

        type: [String],
        default: ['#222'],
        required: true,
    },
    featured: {

        type: Boolean,
        default: false
    },
    freeShipping: {

        type: Boolean,
        default: false
    },
    inventory: {

        type: Number,
        required: [true, ' Please Provide Product Inventory'],
        default: 15
    },
    averageRating: {

        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },
  
},
{timestamps: true}
)

module.exports = mongoose.model('Product', ProductSchema)