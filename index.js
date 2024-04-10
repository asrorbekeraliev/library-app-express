const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

const bookRoutes = require('./routes/books.js')


app.use('/books/', bookRoutes)







const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server running on PORT: ' + PORT)
})