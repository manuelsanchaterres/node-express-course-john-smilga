require('dotenv').config()
require('express-async-errors');

const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const connectDB = require('./db/connect')
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const port = process.env.LOCAL_SERVER_HTTP_PORT || 5000
const authRouter = require('./routes/authRoutes')
const cors = require('cors')

// request body format express middleware
app.use(morgan('dev'))
app.use(express.static('./public'))
app.use(cors())
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

// Basic Routes and Middleware

app.get('/', (req,res) => {

    res.send('<h2>Ecommerce Api</h2>')
})

app.get('/api/v1', (req,res) => {

    console.log(req.signedCookies);
    res.send('<h2>Ecommerce Api</h2>')
})


app.use('/api/v1/auth', authRouter)

// not found and errorhandler middlewares

app.use(notFound)
app.use(errorHandlerMiddleware)

const start = async () => {

    try {
        
        await connectDB(process.env.MONGODB_URI_DATABASE_ECOMMERCE_API)

        console.log('Connected to database EcommerceAPI');

        app.listen(port, () => {

            console.log(`Server listening on port ${port}`);
        })
        

    } catch (error) {
        
        console.log(error);
    }
}

start()
