const { UnauthenticatedError, BadRequestError } = require("../errors")
const jwt = require('jsonwebtoken')
const User = require("../models/User")

const authMiddleware = async(req,res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        throw new UnauthenticatedError('Token Not Valid or Missing')

    }

    const token = authHeader.split(' ')[1]

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!decodedToken) {
        
        throw new BadRequestError('Token Verification Failed')
    }

    const {userId} = decodedToken

    const user = await User.findOne({_id: userId})

    if (!user) {

        throw new BadRequestError('User not Found')

    }

    next()
    
}



module.exports = authMiddleware