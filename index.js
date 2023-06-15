require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/people')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())


morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] :response-time :body'))


const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => person.id))
    : 0
    return maxId + 1
}

// app.get('/api/persons', (req, res) => {
//   Person.find({}).then(phonebook => {
//     res.json(phonebook)
//   })
// })

app.get('/api/persons', (req, res) => {
  Person.find({}).then(contacts => {
    res.json(contacts)
  })
})


app.get('/api/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><br>${Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  res.send(person)
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    res.status(404).send('Missing content')
  } else if (persons.find(person => person.name === body.name)){
    res.status(404).send('Name already exists')
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    res.send(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
