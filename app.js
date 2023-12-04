const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Book = require('./models/books');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/bookstore');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
   console.log('Database connected');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/api/books', async (req, res) => {
    const books = await Book.find({});
    res.render('home', { books });
});

app.get('/api/books/new', (req,res) =>{
    res.render('new');
});

app.post('/api/books', async (req, res) => {
    const { title, author, genre } = req.body;
    if (!Book.find({ title: title, author: author, genre: genre })) {
        const book = new Book(req.body);
        await book.save();
    }
    else{
        console.log("Book already exists");
    }
    res.redirect('/api/books');
});

app.get('/api/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('edit', { book });
});

app.put('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndUpdate(id, { ...req.body.book });
    res.redirect('/api/books');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});