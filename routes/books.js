const {Router } = require('express')
const router = Router()
const path = require('path')
const fs = require('fs')
const { ifError } = require('assert')

let books = []
let found_book = false
router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, '..', 'books.json'), 'utf-8', (err, data) => {
        if (err) throw err
        books.push(...JSON.parse(data))
        console.log(books)
        res.send(books)

        books.length = 0 // make empty the array
    })
})

router.get('/:id', (req, res) => {
    let flag = false;
    fs.readFile(path.join(__dirname, '..', 'books.json'), 'utf-8', (err, data) => {
        if (err) throw err
        books.push(...JSON.parse(data))
        // find the book by id
        books.forEach((book) => {
            if(book.id == req.params.id){
                res.send(book)
                found_book = true;
            }
        })
        if(!found_book) res.send('There is no such a book in database')
        books.length = 0 // make empty the array
    })

})

router.post('/', (req, res) => {
    fs.readFile(path.join(__dirname, '..', 'books.json'), 'utf-8', (err, data) => {
        if(err) throw err
        books.push(...JSON.parse(data))
        req.body.id = books[books.length-1].id + 1
        // check if the book is already in database
        books.forEach(book => {
            if(book.title == req.body.title){
                found_book = true
                res.send('The book is already in database')
            }
        })
        if(!found_book){
            books.push(req.body)
            fs.writeFileSync(path.join(__dirname, '..', 'books.json'), JSON.stringify(books))
            res.send('Successfully added !')
        }
        books.length = 0 // make empty the array

    })
})

router.put('/:id', (req, res) => {
    console.log(req.params.id)
    fs.readFile(path.join(__dirname, '..', '/books.json'), 'utf-8', (err, data) => {
        if(err) throw err
        books.push(...JSON.parse(data))
        // search the id
        books.forEach((book, index) => {
            if(book.id == req.params.id){                
                books[index].title = req.body.title
                books[index].author = req.body.author
                
                res.end('Successfully changed')
                found_book = true
            }
        })
        // if not found
        if(!found_book){
            res.end('Book not found with the id ' + req.params.id)
        }
        books.length = 0; // make the array empty
    })
})

router.delete('/:id', (req, res) => {
    fs.readFile(path.join(__dirname, '..', '/books.json'), 'utf-8', (err, data) => {
        if(err) throw err
        books.push(...JSON.parse(data))
        //search for a book by id
        books.forEach((book, index) => {
            if(book.id == req.params.id){
                books.splice(index, 1)  
                save_books_to_database(books) 
                res.end('Seccussfully deleted !!!')             
                found_book = true;
            }
        })
        if(!found_book) res.end('A book not found in database :(')
    })
})

function save_books_to_database(ready_book){
    fs.writeFileSync(path.join(__dirname, '..', '/books.json'), JSON.stringify(ready_book))
}



module.exports = router