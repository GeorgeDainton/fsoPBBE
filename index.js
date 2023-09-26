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


app.get('/api/persons', (req, res) => {
  Person.find({}).then(contacts => {
    res.json(contacts)
  })
})


app.get('/api/info', async (req, res) => {
  const contacts = await Person.find({})
  res.send(`<p>Phonebook has info for ${contacts.length} people</p><br>${Date()}`)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person)
      } else {
        res.status(404).send('Not found')
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  // if (!body.name || !body.number) {
  //   return res.status(400).json({ error: 'Missing content' })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
  .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  // if(!body.name || !body.number) {
  //   return res.status(404).send('MISSING DATA')
  // }

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true
  })
  .then((updatedPerson) => {
    res.json(updatedPerson.toJSON())
  })
  .catch(err => (next(err)))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Destination Unknown'})
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted ID' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
