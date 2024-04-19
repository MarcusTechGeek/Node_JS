"use strict"; 

const port = 3000, // Define the port number for the server
  express = require("express"), // Import the Express.js framework
  app = express(), // Initialize the Express application
  homeController = require("./controllers/homeController"); // Import the route handler from the homeController module

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

// Route handler for GET requests to "/items/:vegetable", using the sendReqParam function from the homeController module
app.get("/items/:vegetable", homeController.sendReqParam);

// Start the server and listen for incoming connections on the specified port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
