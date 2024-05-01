// Importing required modules
const http = require('http'); // HTTP module for creating server
const fs = require('fs'); // File system module for reading files

// Reading contents of HTML files
const homePage = fs.readFileSync('index.html'); // Read contents of index.html
const aboutPage = fs.readFileSync('about.html'); // Read contents of about.html
const contactPage = fs.readFileSync('contact.html'); // Read contents of contact.html
const notFoundPage = fs.readFileSync('notfound.html'); // Read contents of notfound.html

// Creating HTTP server
const server = http.createServer((req, res) => {
    // Logging requested URL
    console.log(req.url);

    // Routing based on requested URL
    if (req.url === '/about') {
        // Sending aboutPage when URL is '/about'
        res.end(aboutPage);
    } else if (req.url === '/contact') {
        // Sending contactPage when URL is '/contact'
        res.end(contactPage);
    } else if (req.url === '/') {
        // Sending homePage when URL is '/'
        res.end(homePage);
    } else {
        // Handling 404 Not Found error for other URLs
        res.writeHead(404);
        res.end(notFoundPage);
    }
});

// Listening on port 3000
server.listen(3000);
