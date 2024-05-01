"use strict";

const router = require("express").Router();
const coursesController = require("../controllers/coursesController");

// Route to get all courses
router.get(
  "/courses",
  coursesController.index, // Middleware to fetch all courses
  coursesController.filterUserCourses, // Middleware to filter courses for the current user
  coursesController.respondJSON // Middleware to respond with JSON data
);

// Route to join a specific course
router.get(
  "/courses/:id/join",
  coursesController.join, // Middleware to handle course joining
  coursesController.respondJSON // Middleware to respond with JSON data
);

// Error handling middleware for courses routes
router.use(coursesController.errorJSON);

module.exports = router;
