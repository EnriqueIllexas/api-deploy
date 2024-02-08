const express = require('express')
const crypto = require('node:crypto')
/*const node = require('node:fs') */
const movies = require("./movies.json")
const z = require('zod')
const { validateMovie, validaPartialMovie } = require('./schemas/movies')

const app = express()
app.use(express.json())
app.disable('x-powered-by')
 
const ACCEPTED_ORIGINGS = [
    'http://127.0.0.1:5500/api-rest/web/index.html',
    'http://127.0.0.1:5500/api-rest/web/localhost:1200/movies',
    'http://127.0.0.1:5500/api-rest/web/index.html',
    'http://localhost:1200',
    'http://127.0.0.1:5500/api-rest/web/index.html/dcdd0fad-a94c-4810-8acc-5f108d3b18c3',
    'http://localhost:1200/movies/dcdd0fad-a94c-4810-8acc-5f108d3b18c3',
]
app.get("/", (req,res) =>{
    res.json({message: "Hola mundo 🚀"})
})

// TODOS LOS RECURSOS DE SEAN MOVIESse identifica con /movies
app.get('/movies', (req, res) =>{
    const origin = req.header('origin')
    if(ACCEPTED_ORIGINGS.includes(origin) || origin)[
        res.header('Access-Control-Allow-Origin', origin)
    ]

    const {genre} = req.query
    if(genre){
        const fileredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() == genre.toLowerCase())
        )
        return res.json(fileredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) =>{
    const { id } = req.params
    const movie = movies.find(movie => movie.id == id)
    if(movie) return res.json(movie)
    res.status(404).json({message: `La peli no se ha encontrado  🚫😢🎬`})
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) { 
    return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
      id: crypto.randomUUID(), // uuid v4
      ... result.data
    }
  
    // Esto no sería REST, porque estamos guardando
    // el estado de la aplicación en memoria
    movies.push(newMovie)
  
    res.status(201).json(newMovie)
  })
app.delete('/movies/:id', (req, res) => {
    const origin = req.header('origin')
    if(ACCEPTED_ORIGINGS.includes(origin) || origin)[
        res.header('Access-Control-Allow-Origin', origin)
    ]

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' })
    }
  
    movies.splice(movieIndex, 1)
  
    return res.json({ message: 'Movie deleted' })
  })
  
app.patch('/movies/:id', (req, res) =>{
    const result = validaPartialMovie(req.body)

    if(!result.success){
        res.status(404).json({error:JSON.parse(result.error.message)})
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if(movieIndex === -1){
        return res.status(404).json({message: "Movie not found"})
    }
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie

    return res.json(updateMovie)

}) 

app.options('/movies/:id', (req, res) =>{
    const origin = req.header('origin')

    if(ACCEPTED_ORIGINGS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT,PATCH,DELETE')
    }
    res.send(200)
})
const PORT = process.env.PORT ?? 1200

app.listen(PORT, () =>{
    console.log(`server listenig on port http://localhost:${PORT}`)
})