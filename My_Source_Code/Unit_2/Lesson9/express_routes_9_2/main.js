"use strict"; 

const port = 3000, // Define the port number for the server
  express = require("express"), // Import the Express.js framework
  app = express(); // Initialize the Express application

// Middleware to parse URL-encoded request bodies
app.use(
  express.urlencoded({
    extended: false // Setting extended to false means that the values can be only strings or arrays
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to log the URL of each incoming request
app.use((req, res, next) => {
  console.log(`request made to: ${req.url}`);
  next(); // Call next() to proceed to the next middleware or route handler
});

// Route handler for POST requests to the root URL ("/")
app.post("/", (req, res) => {
  // Log the parsed body and query parameters of the request
  console.log(req.body); // Log the parsed request body
  console.log(req.query); // Log the query parameters of the request
  res.send("POST Successful!"); // Send a response indicating that the POST request was successful
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
