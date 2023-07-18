const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({

    refreshToken: {
        type: String,
        required: [true, 'Please provide refreshToken']
    },
    ip: {
        type: String,
        required: [true, 'Please provide ip']
    },
    userAgent: {
        type: String,
        required: [true, 'Please provide userAgent']
    },
    isValid: {
        type: Boolean,
        default: true
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user id']

    }

}, {timestamps: true})


module.exports = mongoose.model('Token', TokenSchema)