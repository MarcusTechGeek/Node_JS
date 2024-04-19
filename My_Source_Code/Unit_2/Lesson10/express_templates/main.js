"use strict"; // Enforces strict mode for better JavaScript code quality

const express = require("express"), // Importing the Express framework
  app = express(), // Creating an Express application
  homeController = require("./controllers/homeController"), // Importing the home controller module
  layouts = require("express-ejs-layouts"); // Importing express-ejs-layouts for layout support

app.set("port", process.env.PORT || 3000); // Setting the port for the application
app.set("view engine", "ejs"); // Setting the view engine to EJS

app.use(layouts); // Using express-ejs-layouts middleware for layouts
app.use(
  express.urlencoded({
    extended: false // Middleware to parse URL-encoded bodies
  })
);
app.use(express.json()); // Middleware to parse JSON bodies

app.use((req, res, next) => {
  console.log(`request made to: ${req.url}`); // Logging incoming requests to console
  next(); // Passing control to the next middleware
});

app.get("/name/:myName", homeController.respondWithName); // Route to handle GET requests to /name
app.get("/items/:vegetable", homeController.sendReqParam); // Route to handle GET requests to /items/:vegetable

app.post("/", (req, res) => { // Route to handle POST requests to the root URL
  console.log(req.body); // Logging the request body to console
  console.log(req.query); // Logging the query parameters to console
  res.send("POST Successful!"); // Sending a response
});

app.listen(app.get("port"), () => { // Starting the server
  console.log(`Server running at http://localhost:${app.get("port")}`); // Logging server start message
});
