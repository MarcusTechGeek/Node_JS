"use strict";

// Import required modules
const express = require("express"),
  app = express(),
  router = express.Router(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"), // Import method-override for handling PUT and DELETE requests
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  Subscriber = require("./models/subscriber");

// Set Mongoose Promise to global Promise
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

// MongoDB connection instance
const db = mongoose.connection;

// MongoDB event listener for connection open
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// Set application properties
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

// Middleware setup
router.use(express.static("public")); // Serve static files from the 'public' directory
router.use(layouts); // Use EJS layouts for views
router.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
router.use(methodOverride("_method", { methods: ["POST", "GET"] })); // Override HTTP methods for PUT and DELETE requests
router.use(express.json()); // Parse JSON request bodies
router.use(homeController.logRequestPaths); // Log request paths

// Define routes
router.get("/", homeController.index); // Home page route
router.get("/contact", homeController.getSubscriptionPage); // Contact page route

// User routes
router.get("/users", usersController.index, usersController.indexView); // List all users
router.get("/users/new", usersController.new); // Render form for creating a new user
router.post("/users/create", usersController.create, usersController.redirectView); // Create a new user
router.get("/users/:id/edit", usersController.edit); // Render form for editing a user
router.put("/users/:id/update", usersController.update, usersController.redirectView); // Update a user
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView); // Delete a user
router.get("/users/:id", usersController.show, usersController.showView); // Show details of a user

// Subscriber routes (similar to user routes)
router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);

// Course routes (similar to user and subscriber routes)
router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);

// Subscribe route
router.post("/subscribe", subscribersController.saveSubscriber);

// Error handling middleware
router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

// Use router as middleware in the app
app.use("/", router);

// Start the server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
