"use strict";

const User = require("../models/user"); // Import the User model

module.exports = {
  // Middleware function to retrieve all users from the database
  index: (req, res, next) => {
    User.find()
      .then(users => {
        // Set the retrieved users in the locals object
        res.locals.users = users;
        next(); // Pass control to the next middleware function
      })
      .catch(error => {
        // Log and handle any errors that occur during the database query
        console.log(`Error fetching users: ${error.message}`);
        next(error); // Pass the error to the next middleware function
      });
  },
  // Controller function to render the users index view
  indexView: (req, res) => {
    res.render("users/index"); // Render the "users/index" view
  }
};
