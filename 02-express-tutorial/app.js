const express = require('express')
const app = express()

const {routes_people, routes_auth} = require('./routes/index')

// static assets
app.use(express.static('./methods-public'))
// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())

app.use('/api/people', routes_people)

app.use('/login', routes_auth)


app.listen(5000, () => {
  console.log('Server is listening on port 5000....')
})
