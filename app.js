var express = require('express');
var app = express();
const Book = require('./models/book')
var bodyParser = require("body-parser");
const { update } = require('lodash');
const Chapter = require('./models/chapter');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/files", express.static(__dirname + "/public/static"));

app.get('/broken', (req, res, next) => {
    res.sendStatus(500)
})

app.get('/forbidden', (req, res, next) => {
    res.sendStatus(403)
})

app.get('/api/books', (req, res, next) => {
    if (req.query.title) {
        Book.findAll({
            where: {
                title: req.query.title
            }
        })
        .then(books => {
        res.send(books)
    })
    } else {
        Book.findAll()
            .then((book) => {
            res.send(book)
        })
    }

})


app.post("/api/books", (req, res, next) => {
    Book.create(req.body)
        .then((book) => {
            res.status(201)
            res.send(book)
    })
});
  
app.get('/api/books/:id', (req, res, next) => {
    if (req.params.id != (Number(req.params.id))) {
        res.sendStatus(500)
    }
    Book.findByPk(req.params.id)
        .then((book) => {
            if (book) {
                res.send(book)
            } else {
                res.sendStatus(404)
            }
        
    })
})

app.put('/api/books/:id', (req, res, next) => {
    if (req.params.id != (Number(req.params.id))) {
        res.sendStatus(500)
    }

    Book.findByPk(req.params.id)
        .then((libroEncontrado) => {
            if (libroEncontrado) {
                libroEncontrado.update({
                    title: req.body.title
                })
                    .then((libroActualizado) => {
                    res.send(libroActualizado)
                })
            } else {
                res.sendStatus(404)
            }
    })
})

app.delete('/api/books/:id', (req, res, next) => {
    if (req.params.id != (Number(req.params.id))) {
        res.sendStatus(500)
    }
    Book.findByPk(req.params.id)
        .then((libroEncontrado) => {
            if (libroEncontrado) {
                libroEncontrado.destroy()
                    .then(() => {
                    res.sendStatus(204)
                })
            } else {
                res.sendStatus(404)
        }
    })
})

app.get('/api/books/:id/chapters', (req, res, next) =>{
    Chapter.findAll()
        .then((chapters) => {
        res.send(chapters)
    })
})

app.post('/api/books/:id/chapters', (req, res, next) => {
    /* Chapter.create({
    ...req.body, bookId: req.params.id
    }) */
    
    Chapter.create({
        title: req.body.title,
            text: req.body.text,
        number: req.body.number,
        bookId: req.params.id
    })
        .then((chapter) => {
        res.status(201).send(chapter)
    })
})







module.exports = app;