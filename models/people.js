const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const uri = process.env.PHONEBOOK_URI

mongoose.connect(uri)
  .then(res => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log('Error connecting to DB')
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)