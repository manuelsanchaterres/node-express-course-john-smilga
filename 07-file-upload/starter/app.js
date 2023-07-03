require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// database
const connectDB = require('./db/connect');


// file uploading

const expressFileUpload = require('express-fileupload')

// USE V2
// const cloudinary = require('cloudinary').v2
// cloudinary.config({

//   cloud_name: process.env.CLOUDINARY_ENVIRONMENT_NAME,
//   api_key: process.env.CLOUDINARY_ENVIRONMENT_API_KEY,
//   api_secret: process.env.CLOUDINARY_ENVIRONMENT_API_SECRET,
// })

// app routers

const productRouter = require('./routes/productRoutes')

// express middlewares
app.use(express.static('./public'))
app.use(express.json())
app.use(expressFileUpload({
  // useTempFiles: true,
  // safeFileNames: true
}))

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// app routes


app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>');
});


app.use('/api/v1/products', productRouter)

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.LOCAL_SERVER_HTTP_PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI_DATABASE_FILEUPLOAD);
    console.log('Connected to database FileUpload');

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
