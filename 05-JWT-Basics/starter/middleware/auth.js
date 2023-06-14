const { UnauthenticatedError } = require("../errors")

const jwt = require('jsonwebtoken')

const authentication = async (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        throw new UnauthenticatedError("Invalid or no token provided")

    }

    // const regEx = /^Bearer /

    // if (!authHeader || !(regEx.test(authHeader))) {

    //     throw new CustomAPIError("Invalid or no token provided", 401)

    // }


    const token = authHeader.split(' ')[1]

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const {id, username} = decoded

        req.user = {id, username}

        next()

    } catch (error) {

        throw new UnauthenticatedError("Not authorized to access this route")

        
    }

}

module.exports = authentication