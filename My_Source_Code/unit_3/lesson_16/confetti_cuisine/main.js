"use strict";

// Import necessary modules
const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"), // Import home controller module
  errorController = require("./controllers/errorController"), // Import error controller module
  subscribersController = require("./controllers/subscribersController"), // Import subscribers controller module
  layouts = require("express-ejs-layouts"), // Import express-ejs-layouts module
  mongoose = require("mongoose"); // Import mongoose module

// Connect to MongoDB database
mongoose.connect(
  "mongodb://localhost:27017/confetti_cuisine", // MongoDB URI
  { useNewUrlParser: true } // Configuration options
);
mongoose.set("useCreateIndex", true); // Set option to use createIndex instead of ensureIndex

// Set up Express app settings
app.set("view engine", "ejs"); // Set view engine to EJS
app.set("port", process.env.PORT || 3000); // Set port

// Middleware for parsing urlencoded and JSON request bodies
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

// Middleware for using layouts
app.use(layouts);

// Middleware for serving static files from the public directory
app.use(express.static("public"));

// Routes

// Home route
app.get("/", (req, res) => {
  res.render("index"); // Render index view
});

// Subscribers routes
app.get("/subscribers", subscribersController.getAllSubscribers); // GET route to retrieve all subscribers
app.get("/contact", subscribersController.getSubscriptionPage); // GET route to show subscription page
app.post("/subscribe", subscribersController.saveSubscriber); // POST route to save subscriber data

// Courses routes
app.get("/courses", homeController.showCourses); // GET route to show courses

// Contact form submission route
app.post("/contact", homeController.postedSignUpForm); // POST route to handle contact form submission

// Error handling routes
app.use(errorController.pageNotFoundError); // Middleware to handle 404 errors
app.use(errorController.internalServerError); // Middleware to handle 500 errors

// Start the server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`); // Log server start message
});
