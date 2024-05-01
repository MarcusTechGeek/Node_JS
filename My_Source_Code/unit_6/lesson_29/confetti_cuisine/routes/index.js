"use strict";

const router = require("express").Router(); // Importing Express Router
const userRoutes = require("./userRoutes"); // Importing user routes
const subscriberRoutes = require("./subscriberRoutes"); // Importing subscriber routes
const courseRoutes = require("./courseRoutes"); // Importing course routes
const errorRoutes = require("./errorRoutes"); // Importing error routes
const homeRoutes = require("./homeRoutes"); // Importing home routes
const apiRoutes = require("./apiRoutes"); // Importing API routes

// Define routes for different modules
router.use("/api", apiRoutes); // Route for API endpoints
router.use("/users", userRoutes); // Route for user management
router.use("/subscribers", subscriberRoutes); // Route for subscriber management
router.use("/courses", courseRoutes); // Route for course management
router.use("/", homeRoutes); // Route for home page
router.use("/", errorRoutes); // Route for error handling

module.exports = router; // Exporting the router
