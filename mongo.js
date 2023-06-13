const mongoose = require('mongoose')

mongoose.set("strictQuery", false);

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://kreagor:${password}@lmcluster1.trbxtv1.mongodb.net/phonebook?retryWrites=true&w=majority`;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(uri)
    .then(console.log("Connected"))

const PersonModelSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', PersonModelSchema)



  if (process.argv.length == 3) {
    console.log("Searching...")
    Person.find({})
      .then(persons => {
        console.log("Phonebook:")
        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
  } else if (process.argv.length > 3) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4]
    })

  await person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
  }
}
