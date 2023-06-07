const express = require('express')
const app = express()
const {logger} = require('./middlewares/index')

app.use('/api',logger)

app.get('/', (req, res) => {

  res.send('home page')

})

app.get('/about', (req, res) => {

  res.end('about page')
  
})

app.get('/api/products', (req, res) => {

  res.end('about page')
  
})

app.get('/api/items', (req, res) => {

  res.end('about page')
  
})



app.listen(5000, () => {

  console.log('server is running on port 5000...');

})

