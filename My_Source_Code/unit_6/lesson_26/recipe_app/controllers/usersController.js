"use strict";

const User = require("../models/user"), // Importing the User model
  passport = require("passport"), // Importing the passport library for authentication
  getUserParams = body => { // Function to extract user parameters from request body
    return {
      name: { // User's name object
        first: body.first, // First name
        last: body.last // Last name
      },
      email: body.email, // User's email
      password: body.password, // User's password
      zipCode: body.zipCode // User's zip code
    };
  };

// Exporting various controller methods
module.exports = {
  // Method to fetch all users from the database
  index: (req, res, next) => {
    User.find() // Finding all users
      .then(users => {
        res.locals.users = users; // Storing users in response locals
        next(); // Proceeding to next middleware
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`); // Logging error message
        next(error); // Passing error to error handling middleware
      });
  },
  // Method to render index view for users
  indexView: (req, res) => {
    res.render("users/index"); // Rendering index view for users
  },
  // Method to render form for creating a new user
  new: (req, res) => {
    res.render("users/new"); // Rendering form for creating a new user
  },
  // Method to create a new user
  create: (req, res, next) => {
    if (req.skip) next(); // If skip flag is set, skip to next middleware
    let newUser = new User(getUserParams(req.body)); // Creating a new user object
    User.register(newUser, req.body.password, (error, user) => { // Registering the new user
      if (user) {
        req.flash("success", `${user.fullName}'s account created successfully!`); // Flash success message
        res.locals.redirect = "/users"; // Set redirect path
        next(); // Proceed to next middleware
      } else {
        req.flash("error", `Failed to create user account because: ${error.message}.`); // Flash error message
        res.locals.redirect = "/users/new"; // Set redirect path
        next(); // Proceed to next middleware
      }
    });
  },
  // Method to handle redirection
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect; // Get redirect path from response locals
    if (redirectPath) res.redirect(redirectPath); // Redirect if redirect path exists
    else next(); // Otherwise, proceed to next middleware
  },
  // Method to fetch a user by ID
  show: (req, res, next) => {
    let userId = req.params.id; // Get user ID from request parameters
    User.findById(userId) // Find user by ID
      .then(user => {
        res.locals.user = user; // Store user in response locals
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`); // Log error message
        next(error); // Pass error to error handling middleware
      });
  },
  // Method to render view for a single user
  showView: (req, res) => {
    res.render("users/show"); // Render view for a single user
  },
  // Method to render form for editing user details
  edit: (req, res, next) => {
    let userId = req.params.id; // Get user ID from request parameters
    User.findById(userId) // Find user by ID
      .then(user => {
        res.render("users/edit", { // Render edit form with user data
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`); // Log error message
        next(error); // Pass error to error handling middleware
      });
  },
  // Method to update user details
  update: (req, res, next) => {
    let userId = req.params.id, // Get user ID from request parameters
      userParams = { // User parameters to update
        name: { // User's name object
          first: req.body.first, // First name
          last: req.body.last // Last name
        },
        email: req.body.email, // User's email
        password: req.body.password, // User's password
        zipCode: req.body.zipCode // User's zip code
      };
    User.findByIdAndUpdate(userId, { // Find user by ID and update
      $set: userParams // Set user parameters
    })
      .then(user => {
        res.locals.redirect = `/users/${userId}`; // Set redirect path
        res.locals.user = user; // Store user in response locals
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`); // Log error message
        next(error); // Pass error to error handling middleware
      });
  },
  // Method to delete a user
  delete: (req, res, next) => {
    let userId = req.params.id; // Get user ID from request parameters
    User.findByIdAndRemove(userId) // Find user by ID and remove
      .then(() => {
        res.locals.redirect = "/users"; // Set redirect path
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`); // Log error message
        next(); // Pass error to error handling middleware
      });
  },
  // Method to render login form
  login: (req, res) => {
    res.render("users/login"); // Render login form
  },
  // Method to authenticate user login
  authenticate: passport.authenticate("local", { // Use local strategy for authentication
    failureRedirect: "/users/login", // Redirect on authentication failure
    failureFlash: "Failed to login.", // Flash message on authentication failure
    successRedirect: "/", // Redirect on authentication success
    successFlash: "Logged in!" // Flash message on authentication success
  }),
  // Method to validate user input
  validate: (req, res, next) => {
    req // Sanitize and validate user input
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true
      })
      .trim();
    req.check("email", "Email is invalid").isEmail(); // Check email validity
    req // Check zip code validity
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5
      })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty(); // Check password validity

    req.getValidationResult().then(error => { // Get validation result
      if (!error.isEmpty()) { // If validation error exists
        let messages = error.array().map(e => e.msg); // Map error messages
        req.skip = true; // Set skip flag
        req.flash("error", messages.join(" and ")); // Flash error messages
        res.locals.redirect = "/users/new"; // Set redirect path
        next(); // Proceed to next middleware
      } else {
        next(); // Proceed to next middleware if no validation error
      }
    });
  },
  // Method to logout user
  logout: (req, res, next) => {
    req.logout(); // Logout user
    req.flash("success", "You have been logged out!"); // Flash success message
    res.locals.redirect = "/"; // Set redirect path
    next(); // Proceed to next middleware
  }
};
