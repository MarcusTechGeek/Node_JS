"use strict";

const Course = require("../models/course"), // Importing the Course model
  httpStatus = require("http-status-codes"), // Importing HTTP status codes module
  User = require("../models/user"); // Importing the User model

// Exporting controller methods for handling course-related functionalities
module.exports = {
  // Method to fetch all courses
  index: (req, res, next) => {
    Course.find({}) // Find all courses
      .then(courses => {
        res.locals.courses = courses; // Store courses in response locals
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`); // Log error message
        next(error); // Pass error to error handling middleware
      });
  },
  // Method to render view for all courses
  indexView: (req, res) => {
    res.render("courses/index"); // Render view for all courses
  },
  // Method to render form for creating a new course
  new: (req, res) => {
    res.render("courses/new"); // Render form for creating a new course
  },
  // Method to create a new course
  create: (req, res, next) => {
    let courseParams = { // Course parameters from request body
      title: req.body.title,
      description: req.body.description,
      items: [req.body.items.split(",")], // Splitting items string into array
      zipCode: req.body.zipCode
    };
    Course.create(courseParams) // Create a new course
      .then(course => {
        res.locals.redirect = "/courses"; // Set redirect path
        res.locals.course = course; // Store created course in response locals
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`); // Log error message
        next(error); // Pass error to error handling middleware
      });
  },
  // Method to fetch a course by ID
  show: (req, res, next) => {
    let courseId = req.params.id; // Get course ID from request parameters
    Course.findById(courseId) // Find course by ID
      .then(course => {
        res.locals.course = course; // Store course in response locals
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`); // Log error message
        next(error); // Pass error to error handling middleware
      });
  },
  // Method to render view for a single course
  showView: (req, res) => {
    res.render("courses/show"); // Render view for a single course
  },
  // Method to render form for editing a course
  edit: (req, res, next) => {
    let courseId = req.params.id; // Get course ID from request parameters
    Course.findById(courseId) // Find course by ID
      .then(course => {
        res.render("courses/edit", { // Render edit form with course data
          course: course
        });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`); // Log error message
        next(error); // Pass error to error handling middleware
      });
  },
  // Method to update a course
  update: (req, res, next) => {
    let courseId = req.params.id, // Get course ID from request parameters
      courseParams = { // Course parameters from request body
        title: req.body.title,
        description: req.body.description,
        items: [req.body.items.split(",")], // Splitting items string into array
        zipCode: req.body.zipCode
      };

    Course.findByIdAndUpdate(courseId, { // Find course by ID and update
      $set: courseParams // Set course parameters
    })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`; // Set redirect path
        res.locals.course = course; // Store updated course in response locals
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`); // Log error message
        next(error); // Pass error to error handling middleware
      });
  },
  // Method to delete a course
  delete: (req, res, next) => {
    let courseId = req.params.id; // Get course ID from request parameters
    Course.findByIdAndRemove(courseId) // Find course by ID and remove
      .then(() => {
        res.locals.redirect = "/courses"; // Set redirect path
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`); // Log error message
        next(); // Pass error to error handling middleware
      });
  },
  // Method to handle redirect
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect; // Get redirect path from response locals
    if (redirectPath !== undefined) res.redirect(redirectPath); // Redirect if path exists
    else next(); // Proceed to next middleware if no redirect path
  },
  // Method to respond with JSON data
  respondJSON: (req, res) => {
    res.json({ // Send JSON response
      status: httpStatus.OK, // Set status to OK
      data: res.locals // Send data from response locals
    });
  },
  // Method to handle JSON errors
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error."
      };
    }
    res.json(errorObject); // Send JSON error response
  },
  // Method to join a course
  join: (req, res, next) => {
    let courseId = req.params.id, // Get course ID from request parameters
      currentUser = req.user; // Get current user from request

    if (currentUser) { // Check if user is logged in
      User.findByIdAndUpdate(currentUser, { // Find user by ID and update
        $addToSet: { // Add course to user's courses
          courses: courseId
        }
      })
        .then(() => {
          res.locals.success = true; // Set success flag in response locals
          next(); // Proceed to next middleware
        })
        .catch(error => {
          next(error); // Pass error to error handling middleware
        });
    } else {
      next(new Error("User must log in.")); // Pass error if user is not logged in
    }
  },
  // Method to filter user-specific courses
  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser; // Get current user from response locals
    if (currentUser) { // Check if user is logged in
      let mappedCourses = res.locals.courses.map(course => { // Map courses to add a 'joined' property
        let userJoined = currentUser.courses.some(userCourse => { // Check if user has joined the course
          return userCourse.equals(course._id);
        });
        return Object.assign(course.toObject(), { joined: userJoined }); // Add 'joined' property to course
      });
      res.locals.courses = mappedCourses; // Replace courses with mapped courses in response locals
      next(); // Proceed to next middleware
    } else {
      next(); // Proceed to next middleware if user is not logged in
    }
  }
};
