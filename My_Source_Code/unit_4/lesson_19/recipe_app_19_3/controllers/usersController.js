"use strict";

// Import the User model
const User = require("../models/user");

// Controller for handling user-related operations
module.exports = {
  // Retrieve all users from the database
  index: (req, res, next) => {
    // Find all users
    User.find()
      .then(users => {
        // Store users in response locals
        res.locals.users = users;
        // Move to the next middleware
        next();
      })
      .catch(error => {
        // Log and handle errors
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  // Render the view for displaying all users
  indexView: (req, res) => {
    res.render("users/index");
  },

  // Render the view for creating a new user
  new: (req, res) => {
    res.render("users/new");
  },

  // Create a new user
  create: (req, res, next) => {
    // Extract user parameters from request body
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    
    // Create a new user with the extracted parameters
    User.create(userParams)
      .then(user => {
        // Store user in response locals
        res.locals.redirect = "/users";
        res.locals.user = user;
        // Move to the next middleware
        next();
      })
      .catch(error => {
        // Log and handle errors during user creation
        console.log(`Error saving user: ${error.message}`);
        next(error);
      });
  },

  // Redirect view
  redirectView: (req, res, next) => {
    // Retrieve the redirect path from response locals
    let redirectPath = res.locals.redirect;
    // Redirect if there's a redirect path
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  // Show user details
  show: (req, res, next) => {
    // Extract user ID from request parameters
    let userId = req.params.id;
    // Find user by ID
    User.findById(userId)
      .then(user => {
        // Store user in response locals
        res.locals.user = user;
        // Move to the next middleware
        next();
      })
      .catch(error => {
        // Log and handle errors during user retrieval
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  // Render the view for displaying user details
  showView: (req, res) => {
    res.render("users/show");
  }
};
