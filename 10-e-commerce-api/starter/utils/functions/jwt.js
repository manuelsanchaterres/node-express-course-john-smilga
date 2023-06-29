const jwt = require('jsonwebtoken');

const createJwt = ({payload}) => {

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME
        }
        
    )

}

const isTokenValid = ({token}) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({res,user}) => {

    const token = createJwt({payload: user})

    const oneDay = 1000*60*60*24
    
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    })

    res.status(201).json({user})

}

const removeCookiesFromResponse = ({res}) => {

    // res.clearCookie('token')

    res.cookie('token', 'logout', {

        httpOnly: true,
        expires: new Date(Date.now())
    })

    res.status(200).json({msg: 'user logged out'})

}

module.exports = {createJwt, isTokenValid, attachCookiesToResponse, removeCookiesFromResponse}