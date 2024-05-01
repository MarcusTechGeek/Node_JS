// Importing required modules
const express = require('express'); // Express framework for creating web applications
const app = express(); // Creating an instance of Express
const path = require('path'); // Path module for working with file and directory paths

// Serving static files from the 'public' directory with caching options
app.use(express.static(__dirname + "/public", {
    index: false, // Disabling directory index
    immutable: true, // Setting immutable response headers
    cacheControl: true, // Enabling cache control headers
    maxAge: "30d" // Setting maximum age for cache
}));

// Handling GET request to root URL '/'
app.get('/', (req, res) => {
    // Sending 'index.html' file as response
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Handling GET request to '/about' URL
app.get('/about', (req, res) => {
    // Sending 'about.html' file as response
    res.sendFile(path.resolve(__dirname, 'about.html'));
});

// Handling GET request to '/contact' URL
app.get('/contact', (req, res) => {
    // Sending 'contact.html' file as response
    res.sendFile(path.resolve(__dirname, 'contact.html'));
});

// Starting the server and listening on port 3000
app.listen(3000, () => {
    console.log("App listening on port 3000");
});
