// Importing required modules
const express = require('express'); // Express framework for creating web applications
const path = require('path'); // Path module for working with file and directory paths
const mongoose = require('mongoose'); // Mongoose for MongoDB object modeling
const ejs = require('ejs'); // EJS for templating engine

// Creating an Express application instance
const app = new express();

// Setting the view engine to EJS
app.set('view engine', 'ejs');

// Serving static files from the 'public' directory
app.use(express.static('public'));

// Connecting to MongoDB database named 'my_database'
mongoose.connect('mongodb://localhost:27017/my_database', { useNewUrlParser: true, useUnifiedTopology: true });

// Handling GET request to root URL '/'
app.get('/', (req, res) => {
    // Rendering 'index.ejs' template
    res.render('index');
});

// Handling GET request to '/about' URL
app.get('/about', (req, res) => {
    // Rendering 'about.ejs' template
    res.render('about');
});

// Handling GET request to '/contact' URL
app.get('/contact', (req, res) => {
    // Rendering 'contact.ejs' template
    res.render('contact');
});

// Handling GET request to '/post' URL
app.get('/post', (req, res) => {
    // Rendering 'post.ejs' template
    res.render('post');
});

// Starting the server and listening on port 4000
app.listen(4000, () => {
    console.log('App listening on port 4000');
});
