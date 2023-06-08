const express = require('express')
const app = express()

let {people} = require('./data')

app.use(express.json()) // for parsing application/json

app.get('/api/people', (req,res) => {

  if (people.length < 1) {

    res.status(200).send("no people found")

  }

  res.status(200).json(people)

})

app.get('/api/people/:personId', (req,res) => {

  const {personId} = req.params


  if (!personId) {

    return res.status(404).send('user id is required')

  }

  const newPerson = people.find((person) => person.id === parseInt(personId))

  if (!newPerson) {

    res.status(200).send(`user ${personId} was not found`)

  }

  const response = {

    message: `user ${personId} was found`,
    data: newPerson
  }

  res.status(200).json(response)

})


app.post('/api/people', (req,res) => {

  const {id, name} = req.body

  if (!id || !name) {

    return res.status(400).send('<h1>name or surname is missing</h1>')

  }

  people = [...people, req.body]

  const response = {

    message: `user ${id} successfully created`,
    data: people
  }
  res.status(200).json(response)


})

app.put('/api/people/:personId', (req,res) => {

  const {name} = req.body
  const {personId} = req.params


  if (!personId) {

    return res.status(404).send('user id is required')

  }

  if (!name) {

    return res.status(400).send('name or surname is missing')

  }

  const newPeople = people.map((person) => {

    if (person.id === parseInt(personId)) {

      const newPerson = {...person, name: req.body.name}
      return newPerson
    }

    return person

  })

  const response = {

    message: `user ${personId} successfully updated`,
    data: newPeople
  }
  res.status(200).json(response)

})

app.delete('/api/people/:personId', (req,res) => {

  const {personId} = req.params


  if (!personId) {

    return res.status(400).send('user id is required')

  }

  const newPeople = people.filter((person) => person.id !== parseInt(personId))


  const response = {

    message: `user ${personId} successfully removed`,
    data: newPeople
  }
  res.status(200).json(response)

})

app.listen(5000, () => {


  console.log('server running on port 5000...');

})