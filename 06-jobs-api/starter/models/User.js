const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({

    name:{

        type: String,
        required: [true, 'Please Provide Name'],
        minlength: 3,
        maxlength: 50,
    },

    email:{

        type: String,
        required: [true, 'Please Provide Email'],
        match: [

            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please Provide Valid Email"
        ],
        unique: true,

    },

    password:{

        type: String,
        required: [true, 'Please Provide Password'],
        minlength: 6,
    },


})

/* mongoose middleware to apply some document field 
modifications before passing them to the model */

UserSchema.pre('save', async function (next) {

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt)
    
    next()

})

UserSchema.methods.createJWT = function () {

    const token = jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {

        expiresIn: process.env.JWT_LIFETIME,

    })

    return token
}

UserSchema.methods.comparePassword = async function (candidatepassword) {


    const isMatch = await bcrypt.compare(candidatepassword, this.password)

    return isMatch
    
}



module.exports = mongoose.model('User', UserSchema)