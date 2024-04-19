"use strict";

const port = 3000, // Define the port number for the server
  express = require("express"), // Import the Express.js framework
  app = express(); // Initialize the Express application

// Middleware to log the URL of each incoming request
app.use((req, res, next) => {
  console.log(`request made to: ${req.url}`);
  next(); // Call next() to proceed to the next middleware or route handler
});

// Route handler for GET requests to "/items/:vegetable"
app.get("/items/:vegetable", (req, res) => {
  // Extract the value of the "vegetable" parameter from the URL
  let veg = req.params.vegetable;
  // Send a response with a message containing the value of the "vegetable" parameter
  res.send(`This is the page for ${veg}`);
});

// Start the server and listen for incoming connections on the specified port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

