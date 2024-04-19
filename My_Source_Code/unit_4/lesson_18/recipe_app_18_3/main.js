"use strict";

const express = require("express"), // Import the express module
  app = express(), // Create an express application
  layouts = require("express-ejs-layouts"), // Import express-ejs-layouts for layout support
  mongoose = require("mongoose"), // Import mongoose for MongoDB interactions
  errorController = require("./controllers/errorController"), // Import the error controller
  homeController = require("./controllers/homeController"), // Import the home controller
  subscribersController = require("./controllers/subscribersController"), // Import the subscribers controller
  usersController = require("./controllers/usersController"), // Import the users controller
  coursesController = require("./controllers/coursesController"), // Import the courses controller
  Subscriber = require("./models/subscriber"); // Import the Subscriber model

mongoose.Promise = global.Promise; // Set Mongoose Promise to global Promise

// Connect to MongoDB database
mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true); // Set option to create indexes

const db = mongoose.connection;

// Event listener for when the database connection is open
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000); // Set the port for the application
app.set("view engine", "ejs"); // Set the view engine to EJS

// Middleware to serve static files from the 'public' directory
app.use(express.static("public"));
// Middleware for using layouts
app.use(layouts);
// Middleware for parsing url-encoded bodies
app.use(
  express.urlencoded({
    extended: false
  })
);
// Middleware for parsing JSON bodies
app.use(express.json());
// Middleware to log request paths
app.use(homeController.logRequestPaths);

// Define routes
app.get("/", homeController.index);
app.get("/contact", homeController.getSubscriptionPage);
app.get("/users", usersController.index, usersController.indexView);
app.get("/subscribers", subscribersController.index, subscribersController.indexView);
app.get("/courses", coursesController.index, coursesController.indexView);
app.post("/subscribe", subscribersController.saveSubscriber);

// Error handling middleware
app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

// Start the server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
