const express = require('express')
const dbConnectionsParameters = require('./utils/constants/dbConnectionsParameters')
const app = express()
require('dotenv').config()
require('express-async-errors')
const port = process.env.LOCAL_SERVER_HTTP_PORT || 3000
const {routes_products} = require('./routes/index')
const { not_found, error_handler, enable_cors } = require('./middlewares')


// req.body content formats

app.use(express.json())

app.use(express.urlencoded({extended: true}))

// Middleware to enable CORS

app.use(enable_cors)

// Home route
app.get('/', (req,res) => {

  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')

})

// Producs route

app.use('/api/v1/products', routes_products)

// not found url error message

app.use([not_found,error_handler])

// databases and server startup

const startDatabase = async (dbConnection) => {
    
   const {databaseName,connectionFn, connectionString} = dbConnection

   try {

    await connectionFn(connectionString)

    console.log(`connected to database ${databaseName}`);

   } catch (error) {
    
    console.log(`NOT connected to database ${databaseName}`);
    console.log(error);

   }


}


Promise.all(dbConnectionsParameters.map(startDatabase))
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port: ${port}...`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
});
