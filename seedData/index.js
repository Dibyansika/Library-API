const mongoose = require('mongoose');
const Book = require('../models/books');
const bookData = require('./books');

mongoose.connect('mongodb://localhost:27017/bookstore');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
   console.log('Database connected');
});

const seedDB = async () => {
    await Book.deleteMany({});
    for(let i = 0; i < bookData.length; i++) {
        const book = new Book({
            title: bookData[i].title,
            author: bookData[i].author,
            genre: bookData[i].genre
        });
        await book.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

