"use strict";

// Importing necessary modules
const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"), // Importing home controller module
  errorController = require("./controllers/errorController"), // Importing error controller module
  layouts = require("express-ejs-layouts"); // Importing express-ejs-layouts module

// Setting the view engine to EJS
app.set("view engine", "ejs");

// Setting the port for the Express application
app.set("port", process.env.PORT || 3000);

// Middleware for parsing urlencoded request bodies
app.use(
  express.urlencoded({
    extended: false
  })
);

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for using express-ejs-layouts for layout management
app.use(layouts);

// Middleware for serving static files from the 'public' directory
app.use(express.static("public"));

// Handling GET request for the root route '/'
app.get("/", (req, res) => {
  res.render("index"); // Rendering the 'index' view
});

// Handling GET request for the '/courses' route
app.get("/courses", homeController.showCourses);

// Handling GET request for the '/contact' route
app.get("/contact", homeController.showSignUp);

// Handling POST request for the '/contact' route
app.post("/contact", homeController.postedSignUpForm);

// Error handling middleware for handling 404 errors
app.use(errorController.pageNotFoundError);

// Error handling middleware for handling internal server errors
app.use(errorController.internalServerError);

// Starting the Express server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
