const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide name'],
        minLength:3,
        maxLength:50
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} is not a valid email!`
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength:6,
        validate: {
            validator: validator.isStrongPassword,
            message: props => `${props.value} is not a valid password!`
        },
    },
    role: {

        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }



},{timestamps: true});

/* Document middleware to hash the password before creating
document in the database collection */
UserSchema.pre('save', async function () {

    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});

UserSchema.methods.comparePassword = async function(candidatePassword){

    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema);
