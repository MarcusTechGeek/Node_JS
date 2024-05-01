// Importing required modules
const express = require('express'); // Express framework for creating web applications
const path = require('path'); // Path module for working with file and directory paths
const bodyParser = require('body-parser'); // Body parser middleware for parsing incoming request bodies
const mongoose = require('mongoose'); // Mongoose for MongoDB object modeling
const BlogPost = require('./models/BlogPost'); // Importing the BlogPost model

// Creating an Express application instance
const app = new express();

// Setting the view engine to EJS
app.set('view engine', 'ejs');

// Serving static files from the 'public' directory
app.use(express.static('public'));

// Parsing JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting to MongoDB database named 'my_database'
mongoose.connect('mongodb://localhost/my_database', { useUnifiedTopology: true, useNewUrlParser: true });

// Starting the server and listening on port 4000
app.listen(4000, () => {
    console.log('App listening on port 4000');
});

// Route for rendering the home page and fetching all blog posts
app.get('/', async (req, res) => {
    const blogposts = await BlogPost.find({});
    res.render('index', {
        blogposts: blogposts
    });
});

// Route for rendering the about page
app.get('/about', (req, res) => {
    res.render('about');
});

// Route for rendering the contact page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Route for rendering the blog post creation form
app.get('/create', (req, res) => {
    res.render('create');
});

// Route for rendering a sample blog post
app.get('/samplepost', (req, res) => {
    res.render('samplepost');
});

// Route for rendering the blog post creation form
app.get('/posts/new',(req,res)=>{ 
    res.render('create')
});

// Route for rendering a specific blog post by its ID
app.get('/post/:id', async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post', {
        blogpost: blogpost
    });
});

// Route for storing a new blog post
app.post('/posts/store', async (req, res) => {
    await BlogPost.create(req.body, (error, blogpost) => {
        res.redirect('/');
    });
});
