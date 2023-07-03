const CustomError = require('../errors')

const checkPermissions = (...roles) => {

    return (req, res, next) => {

        if(!roles.includes(req.user.role)) {

            throw new CustomError.ForbidenAccessError('Unauthorized to access this route')
        }

        // check if the user requesting to get single user if the one who created it or admin

        if (req.user.role && req.params.id) {

            if (req.user.role === 'user' && (req.user.userId !== req.params.id)) {


                throw new CustomError.ForbidenAccessError('Not owner of the modified resource')
    
            }
    
        }

        next();
    }
}


module.exports = {checkPermissions}