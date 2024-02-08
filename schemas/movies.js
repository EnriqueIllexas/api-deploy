const z = require('zod')

const movieShema = z.object({
    title: z.string({
        required_error: "movie title is required"
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5.5),
    poster: z.string().url({
        message: 'poster must be a valid url'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-fi']),
        {
            required_error: "movie genre is required",
            invalid_type_error: "movie genre must be an array of enum Genre"
        }
    )
})

function validateMovie (input){
    return movieShema.safeParse(input)
}
function validaPartialMovie(input){
    return movieShema.partial().safeParse(input)
}

module.exports = {
    validateMovie,
    validaPartialMovie
};
