const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

// we can use predefined format string like tiny
// app.use(morgan('tiny'))

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

/*
const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)
*/

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    let date = new Date()
    response.send(`<p>Phonebook has ${persons.length} entries</p>
    <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }

    response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(persons)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const nameExists = persons.find(person => person.name.toUpperCase() === body.name.toUpperCase())
    if (nameExists) {
        response.status(400).json({
            error: 'name already exists'
        })
    }

    const person = {
        id: parseInt(Math.random() * 10000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)

})

const unKnownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unKnownEndPoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})