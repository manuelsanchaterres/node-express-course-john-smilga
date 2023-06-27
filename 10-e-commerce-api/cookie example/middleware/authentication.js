const CustomAPIError = require('../errors/')
const { isTokenValid } = require('../utils/functions');

const authentication = async (req,res,next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        throw new CustomAPIError.BadRequestError('Authorization header format not valid')

    }

    const token = authHeader.split(' ')[1]

    try {
        
        const payload = isTokenValid(token)

        req.user = {userId: payload.userId}

        next()
    } catch (error) {
        
        throw new CustomAPIError.UnauthenticatedError('Authentication failed')
    }

}

module.exports = authentication