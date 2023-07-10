const mongoose = require('mongoose')

const SingleCartItemSchema = new mongoose.Schema({

    name: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    amount: {type: Number, required: true},
    product: {

        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    }

})


const OrderSchema = new mongoose.Schema({

    tax: {

        type: Number,
        required: [true, 'Please introduce Tax Value']

    },

    shippingFee: {

        type: Number,
        required: [true, 'Please introduce ShippingFee Value']
        
    },
    subtotal: {

        type: Number,
        required: [true, 'Please introduce Subtotal Value']
        
    },
    total: {

        type: Number,
        required: [true, 'Please introduce Total Value']
        
    },

    orderItems: [SingleCartItemSchema],

    status: {

        type: String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
        required: [true, 'Please introduce Status Value'],
        default: 'pending'
    },

    user: {

        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide User'],
    },

    clientSecret: {

        type: String,
        required: [true, 'Please introduce ClientSecret Value']
        
    },

    paymentIntentId: {
        type: String,
        default: ""
    },
  
},{timestamps:true})




module.exports = mongoose.model('Order', OrderSchema)