"use strict";

const router = require("express").Router(), // Importing the Router class from the 'express' library
  coursesController = require("../controllers/coursesController"); // Importing the coursesController module

// Setting up routes and associating them with corresponding controller methods
router.get("/courses/:id/join", coursesController.join, coursesController.respondJSON); // Route to join a course by ID
router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  coursesController.respondJSON
); // Route to fetch courses and filter user-specific courses
router.use(coursesController.errorJSON); // Error handling route for JSON responses

module.exports = router; // Exporting the router for use in other modules
