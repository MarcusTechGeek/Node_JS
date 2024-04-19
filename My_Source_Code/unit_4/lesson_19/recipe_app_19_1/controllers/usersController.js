"use strict";

const User = require("../models/user");

module.exports = {
  // Fetch all users from the database
  index: (req, res, next) => {
    User.find()
      .then(users => {
        // Set retrieved users in locals for rendering
        res.locals.users = users;
        // Pass control to the next middleware
        next();
      })
      .catch(error => {
        // Log and handle any errors
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  // Render the view to display all users
  indexView: (req, res) => {
    res.render("users/index");
  },

  // Render the view to create a new user
  new: (req, res) => {
    res.render("users/new");
  },

  // Create a new user based on form data
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

    // Create a new user in the database
    User.create(userParams)
      .then(user => {
        // Set the newly created user in locals for rendering
        res.locals.user = user;
        // Set redirect path to users index page
        res.locals.redirect = "/users";
        // Pass control to the next middleware
        next();
      })
      .catch(error => {
        // Log and handle any errors during user creation
        console.log(`Error saving user: ${error.message}`);
        next(error);
      });
  },

  // Redirect to the specified path
  redirectView: (req, res, next) => {
    // Retrieve the redirect path from locals
    let redirectPath = res.locals.redirect;
    // Redirect to the specified path if it exists
    if (redirectPath) res.redirect(redirectPath);
    // Pass control to the next middleware otherwise
    else next();
  }
};
