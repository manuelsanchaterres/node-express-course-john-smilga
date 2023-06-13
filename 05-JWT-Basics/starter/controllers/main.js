const CustomAPIError = require("../errors/custom_error")
const jwt = require('jsonwebtoken')
require('express-async-errors')

const login = async (req,res) => {

    const {username, password} = req.body

    if (username && password) {

        const id = new Date().getDate()

        const token = jwt.sign({username, id}, process.env.JWT_SECRET, {expiresIn: '30d'})
        
        return res.status(200).json({msg: 'user created', token})

    }


    throw new CustomAPIError("PLease provide email and password", 400)

}

const dashboard = async (req,res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        throw new CustomAPIError("Invalid or no token provided", 401)

    }

    next()
    // const regEx = /^Bearer /

    // if (!authHeader || !(regEx.test(authHeader))) {

    //     throw new CustomAPIError("Invalid or no token provided", 401)

    // }

    
    const luckyNumber = Math.floor(Math.random()*100)

    return res.status(200).json({msg: `Hello, John Doe`, secret: `Here is your authorized data, your lucky number is ${luckyNumber}`})

}


module.exports = {login, dashboard}