require('dotenv').config();
require('express-async-errors')
const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not_found');
const errorHandlerMiddleware = require('./middleware/error_handler');
const mainRouter = require('./routes/main')


// middleware
app.use(express.static('./public'));
app.use(express.json());

app.use('/api/v1', mainRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.LOCAL_SERVER_HTTP_PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
