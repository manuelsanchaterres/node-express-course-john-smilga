const {StatusCodes} = require('http-status-codes')
const User = require('../models/User')
const CustomError = require('../errors')
const {removeCookiesFromResponse,attachCookiesToResponse, createTokenUser} = require('../utils/functions')

const register = async (req, res) => {

    const {name, email, password} = req.body

    const emailAlreadyExists = await User.findOne({email})

    if (emailAlreadyExists) {

        throw new CustomError.BadRequestError(`Email ${email} already exists`)
    }

    const isFirstAccount = await User.countDocuments({}) === 0
    const role = isFirstAccount ? 'admin':'user'
    const user = await User.create({name, email, password,role})
    const tokenUser = createTokenUser({user})

    attachCookiesToResponse({res, user: tokenUser})

    // res.status(StatusCodes.CREATED).json({user:tokenUser})

}

const login = async (req, res) => {

    const {email, password} = req.body

    if (!email || !password) {

        throw new CustomError.BadRequestError('Please introduce email and password')
    }

    const user = await User.findOne({email})

    if (!user) {

        throw new CustomError.UnauthenticatedError('email not valid')

    }

    const isPasswordCorrect = await user.comparePassword(password)
    
    if (!isPasswordCorrect) {

        throw new CustomError.UnauthenticatedError('password not valid')

    }

    const tokenUser = createTokenUser({user})
    attachCookiesToResponse({res, user: tokenUser})

    // res.send('login controller')
}

const logout = async (req, res) => {

    removeCookiesFromResponse({res})
    res.send('logout controller')
}



module.exports = {register, login, logout}