const express = require('express')

const app = express()
const {products} = require('./data')

app.get('/', (req,res) => {

  res.send('<h1>Home Page</h1><a href="/api/products">products</a>')

})

app.get('/api/products', (req,res) => {

  let productsArray = []

  const newProducts = products.map((product) => {

    const {id, name, image} = product

    return {id, name, image}

  })

  res.json(newProducts)
  
})

app.get('/api/products/:productId', (req,res) => {

  const newProduct = products.find((product) => product.id === parseInt(req.params.productId))
  
  if (newProduct) {

    return res.json(newProduct)

  }

  return res.status(404).send(`product with id ${req.params.productId} was not found`)
  
})


app.get('/api/products/:productId/reviews/:reviewId', (req,res) => {

  const {productId, reviewId} = req.params

  console.log({productId, reviewId});

  res.json({productId, reviewId})

})

app.get('/api/product-search/query', (req,res) => {

  const {search, limit} = req.query
  let sortedProducts = [...products]

  if (search) {

    sortedProducts = sortedProducts.filter((product) => {

      return product.name.startsWith(search)

    })
  }

  if (limit) {

    sortedProducts = sortedProducts.slice(0, parseInt(limit))

  }

  if (sortedProducts.length < 1) {

    // res.status(200).send('no product matched your search criteria')

    return res.status(200).json({success: true, data: []})

  }

  return res.json(sortedProducts)

})
app.listen(5000, () => {

  console.log('server is listening on port 5000....');

})