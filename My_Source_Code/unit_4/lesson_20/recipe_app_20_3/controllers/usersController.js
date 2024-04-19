"use strict";

const User = require("../models/user");

module.exports = {
  // Retrieve all users from the database
  index: (req, res, next) => {
    User.find()
      .then(users => {
        res.locals.users = users; // Store users in locals
        next(); // Proceed to the next middleware
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error); // Pass error to the error handling middleware
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
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    User.create(userParams)
      .then(user => {
        res.locals.redirect = "/users"; // Redirect to the users index page
        res.locals.user = user; // Store the created user
        next(); // Proceed to the next middleware
      })
      .catch(error => {
        console.log(`Error saving user: ${error.message}`);
        next(error); // Pass error to the error handling middleware
      });
  },
  // Redirect to the specified URL
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath); // Redirect if a URL is set
    else next(); // Proceed to the next middleware
  },
  // Retrieve a specific user by ID
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.locals.user = user; // Store the retrieved user
        next(); // Proceed to the next middleware
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error); // Pass error to the error handling middleware
      });
  },
  // Render the view for displaying a single user
  showView: (req, res) => {
    res.render("users/show");
  },
  // Render the view for editing a user
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("users/edit", {
          user: user // Pass user data to the view
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error); // Pass error to the error handling middleware
      });
  },
  // Update a user's details
  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last
        },
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode
      };
    User.findByIdAndUpdate(userId, {
      $set: userParams
    })
      .then(user => {
        res.locals.redirect = `/users/${userId}`; // Redirect to the updated user's page
        res.locals.user = user; // Store the updated user
        next(); // Proceed to the next middleware
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error); // Pass error to the error handling middleware
      });
  },
  // Delete a user
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users"; // Redirect to the users index page
        next(); // Proceed to the next middleware
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next(error); // Pass error to the error handling middleware
      });
  }
};
