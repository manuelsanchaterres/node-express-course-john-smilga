require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not_found');
const errorHandlerMiddleware = require('./middleware/error_handler');

// auth middleware

const authMiddleware = require('./middleware/authentication')

// connect database

const connectDB = require('./db/connect'); 

// require routers

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs');


// request body format express built-in middleware

app.use(express.json());

// extra packages

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/jobs/auth', authRouter)
app.use('/api/v1/jobs',authMiddleware, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {

  try {

    await connectDB(process.env.MONGODB_URI_DATABASE_JOBS_API)

    console.log('connected to database JobsApi');
    
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
