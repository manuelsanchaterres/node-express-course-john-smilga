const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.LOCAL_SERVER_HTTP_PORT || 3000
const {routes_tasks} = require('./routes/index')
const connectionString = process.env.MONGO_URI
const connectDB = require('./db/connect')
const { not_found,error_handler} = require('./middlewares')

// const notFound = require('./middlewares/not_found')
// const errorHandler = require('./middlewares/error_handler')
// req.body format express middlewares

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// tasks routes
app.use('/api/v1/tasks', routes_tasks)

// not found url
app.use(not_found)

// error handling
app.use(error_handler)


const startDatabase = async() => {

    try {

        await connectDB(connectionString)

        app.listen(port, () => {console.log(`server running on port: ${port}...`)})
        
    } catch (error) {
        
        console.log("not connected to database");

    }
}

startDatabase()

