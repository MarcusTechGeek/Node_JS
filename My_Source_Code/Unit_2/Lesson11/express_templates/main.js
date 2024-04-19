"use strict";

// Importing necessary modules
const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"), // Importing error controller module
  homeController = require("./controllers/homeController"), // Importing home controller module
  layouts = require("express-ejs-layouts"); // Importing express-ejs-layouts module

// Setting the port for the Express application
app.set("port", process.env.PORT || 3000);
// Setting the view engine to EJS
app.set("view engine", "ejs");

// Middleware for serving static files from the 'public' directory
app.use(express.static("public"));
// Middleware for using express-ejs-layouts for layout management
app.use(layouts);
// Middleware for parsing urlencoded request bodies
app.use(
  express.urlencoded({
    extended: false
  })
);
// Middleware for parsing JSON request bodies
app.use(express.json());
// Middleware for logging request paths
app.use(homeController.logRequestPaths);

// Handling GET request for the '/name' route
app.get("/name", homeController.respondWithName);
// Handling GET request for the '/items/:vegetable' route
app.get("/items/:vegetable", homeController.sendReqParam);

// Handling POST request for the root route '/'
app.post("/", (req, res) => {
  console.log(req.body); // Logging request body
  console.log(req.query); // Logging query parameters
  res.send("POST Successful!"); // Sending response
});

// Error handling middleware for logging errors
app.use(errorController.logErrors);
// Error handling middleware for responding to resource not found errors
app.use(errorController.respondNoResourceFound);
// Error handling middleware for responding to internal server errors
app.use(errorController.respondInternalError);

// Starting the Express server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
