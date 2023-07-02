const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({

    name: {

        type: String,
        required: [true, 'Please introduce name']
    },
    price: {

        type: Number,
        required: [true, 'Please introduce price']
    },

    image: {

        type: String,
        required: [true, 'Image path is required']
    },


},
{timestamps: true}
)

module.exports = mongoose.model('Product', ProductSchema)