"use strict";

const router = require("express").Router(), // Importing the Router class from the 'express' library
  userRoutes = require("./userRoutes"), // Importing userRoutes module
  subscriberRoutes = require("./subscriberRoutes"), // Importing subscriberRoutes module
  courseRoutes = require("./courseRoutes"), // Importing courseRoutes module
  errorRoutes = require("./errorRoutes"), // Importing errorRoutes module
  homeRoutes = require("./homeRoutes"); // Importing homeRoutes module

// Using different route paths and associating them with their respective route modules
router.use("/users", userRoutes); // Routes related to users
router.use("/subscribers", subscriberRoutes); // Routes related to subscribers
router.use("/courses", courseRoutes); // Routes related to courses
router.use("/", homeRoutes); // Home page route
router.use("/", errorRoutes); // Error handling routes

module.exports = router; // Exporting the router for use in other modules
