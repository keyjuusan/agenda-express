const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())

let personas = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

morgan.token("body",(req,res)=>{
    // console.log(req.body)
    return JSON.stringify(req.body)
})
app.use(morgan(":method :url :status :req[body] - :response-time ms :body"))

app.get("/api/personas", (req, res) => {
    res.json(personas)
})

app.get("/info", (req, res) => {
    const date = new Date()

    res.send(`
    <h2>Actualmente en tu agenda tienes ${personas.length} contactos</h2>
    <h3>${date.toUTCString()} ${date.getTimezoneOffset()}</h3>
    `)    
})

app.delete("/api/personas/:id",(req,res)=>{
    const id = Number(req.params.id)
    personas = personas.filter(persona=>persona.id !== id)
    
    res.json(personas)
    res.status(204).end
})

app.post("/api/personas",(req,res)=>{
    const newContact = req.body
    newContact.id = personas.length +1

    personas = personas.concat(newContact)
    res.json(newContact)
})


const PORT = 3002
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`)
})
