const express = require('express')
const path = require('path')
const app = express()

app.get('/', (req,res) => {
  

  res.status(200).sendFile(path.resolve(__dirname, './navbar-app/index.html'))

})


app.get('/:filename', (req,res, next) => {
  
  var options = {

    root: path.join(__dirname, 'navbar-app'),
    dotfiles: 'deny',
    headers: {

      'x-timestamp': Date.now(),
      'x-sent': true
    }

  }

  var filename = req.params.filename
  
  res.sendFile(filename, options, (err) => {

    if (err) {

        next(err)

    } else {

      console.log('Sent:', filename);
    }

  })

})


app.get('*', (req,res) => {

    res.status(404).send('resource not found')

})


app.listen(5000, () => {

    console.log('server is listening on port 5000....');
})