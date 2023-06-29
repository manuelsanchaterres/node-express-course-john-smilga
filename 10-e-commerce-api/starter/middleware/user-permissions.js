const CustomError = require('../errors')

const checkPermissions = (...roles) => {

    return (req, res, next) => {

        if(!roles.includes(req.user.role)) {

            throw new CustomError.ForbidenAccessError('Unauthorized to access this route')
        }

        if (req.user.role === 'user' && (req.user.userId !== req.params.id)) {

            throw new CustomError.ForbidenAccessError('Unauthorized to access this user')

        }

        next();
    }
}


module.exports = {checkPermissions}