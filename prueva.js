/*
const express = require("express")
const app = express()
app.disable('x-powered-by')

app.get('/', (req, res) =>{
    res.json({mesage: "Hola mundo 🚀"})
})

const port = process.env.PORT ?? 3000

app.listen(port, () =>{
    console.log()
})

console.log(`server listening on port http://localhost:${
    port
}`)

 */

const express = require('express')
const app = express()
app.disable('x-powered-by')

app.get('/', (req, res) =>{
    res.json({message: "Wenas"})
})

const PORT = process.env.PORT ?? 3333

app.listen(PORT, () =>{
    console.log(`server listenig on port ${PORT}`)
})

//para el console.log por control+alt + L  n