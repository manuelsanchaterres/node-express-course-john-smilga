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

// App Routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const authenticateUser = require('./middleware/authentication');
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')

// file uploading

const expressFileUpload = require('express-fileupload')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize	')

// USE V2

const cloudinary = require('cloudinary').v2
cloudinary.config({

    cloud_name: process.env.CLOUDINARY_ENVIRONMENT_NAME,
    api_key: process.env.CLOUDINARY_ENVIRONMENT_API_KEY,
    api_secret: process.env.CLOUDINARY_ENVIRONMENT_API_SECRET,
})
  

// request body format express middleware
app.set('trust proxy', 1);
app.use(rateLimiter({

    window: 15*60*1000,
    max: 60,

}))

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

// Basic Routes and Middleware

app.use(express.static('./public'));
app.use(expressFileUpload({
    useTempFiles: true,
    // safeFileNames: true
}))

app.get('/', (req,res) => {

    res.send('<h2>Ecommerce Api</h2>')
})

app.get('/api/v1', (req,res) => {
    res.send('<h2>Ecommerce Api</h2>')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users',authenticateUser, userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders',authenticateUser, orderRouter)

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
