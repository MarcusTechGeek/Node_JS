"use strict";

// Importing required modules
const express = require("express"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  app = express(),
  router = express.Router(),
  // Importing controllers
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  subscribersController = require("./controllers/subscribersController.js"),
  usersController = require("./controllers/usersController.js"),
  coursesController = require("./controllers/coursesController.js");

// Connecting to MongoDB
mongoose.connect("mongodb://localhost:27017/confetti_cuisine", {
  useNewUrlParser: true,
  useCreateIndex: true
});

// Setting up Express application
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

// Middleware setup
router.use(methodOverride("_method", { methods: ["POST", "GET"] }));
router.use(layouts);
router.use(express.static("public"));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// Routes setup
router.get("/", homeController.index);

// User routes
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

// Subscriber routes
router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);

// Course routes
router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

// Error handling middleware
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

// Setting up routes in the Express application
app.use("/", router);

// Starting the server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
