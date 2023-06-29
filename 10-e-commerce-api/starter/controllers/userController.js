const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const CustomError = require('../errors')
const { createTokenUser, attachCookiesToResponse } = require('../utils/functions')

const getAllUsers = async (req, res) => {

    const users = await User.find({role: 'user'}).select('-password')

    if (!users) {

        throw new CustomError.NotFoundError('Users not found')
    }
    
    res.status(StatusCodes.OK).json({users})
}

const getSingleUser = async (req, res) => {

    const user = await User.findById(req.params.id).select('-password')

    if (!user) {

        throw new CustomError.NotFoundError(`User with id ${req.params.id} not found`)
    }

    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async (req, res) => {

    res.status(StatusCodes.OK).json({user:req.user})
}

// with user.save()

const updateUser = async (req, res) => {

    const {name, email} = req.body

    if (!name || !email) {

        throw new CustomError.BadRequestError('name and email required')

    }

    const user = await User.findOne({_id:req.user.userId}).select('-password')

    user.name = name
    user.email = email
    await user.save()
    const tokenUser = createTokenUser({user})
    attachCookiesToResponse({res, user:tokenUser})

    res.status(StatusCodes.OK).json({user})
}


const updateUserPassword = async (req, res) => {

    const {userId} = req.user
    const{oldPassword, newPassword} = req.body

    if (!oldPassword || !newPassword) {

        throw new CustomError.BadRequestError('old and new passwords required')
    }

    const user = await User.findOne({_id:userId})

    if (!user) {

        throw new CustomError.NotFoundError('user not found')

    }

    const isPasswordCorrect = await user.comparePassword(oldPassword)


    if (!isPasswordCorrect) {

        throw new CustomError.UnauthenticatedError('your old password is not correct')

    }

    user.password = newPassword

    await user.save()

    res.status(StatusCodes.OK).json({msg: 'Success! Password Updated'})
}

// const updateUser = async (req, res) => {

//     const {name, email} = req.body

//     if (!name || !email) {

//         throw new CustomError.BadRequestError('name and email required')

//     }

//     const user = await User.findOneAndUpdate({_id:req.user.userId},{name,email}, {new:true, runValidators: true}).select('-password')

//     const tokenUser = createTokenUser({user})
//     attachCookiesToResponse({res, user:tokenUser})
//     console.log(user);

//     res.status(StatusCodes.OK).json({user})
// }


module.exports = {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword}