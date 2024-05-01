"use strict";

const User = require("../models/user"), // Importing User model
  passport = require("passport"), // Importing passport for authentication
  jsonWebToken = require("jsonwebtoken"), // Importing jsonwebtoken for token generation and verification
  getUserParams = body => { // Function to extract user parameters from request body
    return {
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      password: body.password,
      zipCode: body.zipCode
    };
  };

module.exports = {
  index: (req, res, next) => { // Controller for fetching all users
    User.find()
      .then(users => {
        res.locals.users = users;
        next();
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => { // View rendering for user index
    res.render("users/index");
  },
  new: (req, res) => { // View rendering for creating new user
    res.render("users/new");
  },
  create: (req, res, next) => { // Controller for creating new user
    if (req.skip) next(); // Skip if requested
    let newUser = new User(getUserParams(req.body)); // Create new user instance
    User.register(newUser, req.body.password, (error, user) => { // Register user with passport-local-mongoose
      if (user) { // If user registered successfully
        req.flash("success", `${user.fullName}'s account created successfully!`); // Flash success message
        res.locals.redirect = "/users"; // Set redirect path
        next(); // Proceed to next middleware
      } else { // If registration failed
        req.flash("error", `Failed to create user account because: ${error.message}.`); // Flash error message
        res.locals.redirect = "/users/new"; // Set redirect path
        next(); // Proceed to next middleware
      }
    });
  },
  redirectView: (req, res, next) => { // Middleware for redirecting to the specified path
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath); // Redirect if path is specified
    else next(); // Proceed to next middleware if no redirect path
  },
  show: (req, res, next) => { // Controller for fetching a specific user
    let userId = req.params.id; // Get user ID from request parameters
    User.findById(userId) // Find user by ID
      .then(user => {
        res.locals.user = user; // Set user in locals
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => { // View rendering for displaying user details
    res.render("users/show");
  },
  edit: (req, res, next) => { // View rendering for editing user details
    let userId = req.params.id; // Get user ID from request parameters
    User.findById(userId) // Find user by ID
      .then(user => {
        res.render("users/edit", { // Render edit view with user data
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => { // Controller for updating user details
    let userId = req.params.id, // Get user ID from request parameters
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last
        },
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode
      };
    User.findByIdAndUpdate(userId, { // Find and update user by ID
      $set: userParams
    })
      .then(user => {
        res.locals.redirect = `/users/${userId}`; // Set redirect path
        res.locals.user = user; // Set updated user data
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => { // Controller for deleting user
    let userId = req.params.id; // Get user ID from request parameters
    User.findByIdAndRemove(userId) // Find and remove user by ID
      .then(() => {
        res.locals.redirect = "/users"; // Set redirect path
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },
  login: (req, res) => { // View rendering for user login
    res.render("users/login");
  },
  authenticate: passport.authenticate("local", { // Middleware for authenticating user login
    failureRedirect: "/users/login", // Redirect on login failure
    failureFlash: "Failed to login.", // Flash message on login failure
    successRedirect: "/", // Redirect on login success
    successFlash: "Logged in!" // Flash message on login success
  }),
  validate: (req, res, next) => { // Middleware for validating user input
    req // Sanitize and validate user input
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5
      })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();

    req.getValidationResult().then(error => { // Check for validation errors
      if (!error.isEmpty()) { // If validation errors exist
        let messages = error.array().map(e => e.msg); // Extract error messages
        req.skip = true; // Skip to next middleware
        req.flash("error", messages.join(" and ")); // Flash error messages
        res.locals.redirect = "/users/new"; // Set redirect path
        next(); // Proceed to next middleware
      } else { // If no validation errors
        next(); // Proceed to next middleware
      }
    });
  },
  logout: (req, res, next) => { // Controller for user logout
    req.logout(); // Logout user
    req.flash("success", "You have been logged out!"); // Flash success message
    res.locals.redirect = "/"; // Set redirect path
    next(); // Proceed to next middleware
  },
  apiAuthenticate: (req, res, next) => { // Middleware for API authentication
    passport.authenticate("local", (errors, user) => { // Authenticate user using passport-local strategy
      if (user) { // If user authenticated successfully
        let signedToken = jsonWebToken.sign( // Generate signed JWT token
          {
            data: user._id,
            exp: new Date().setDate(new Date().getDate() + 1) // Set token expiration time
          },
          "secret_encoding_passphrase" // Secret passphrase for token encoding
        );
        res.json({ // Respond with success and token
          success: true,
          token: signedToken
        });
      } else // If authentication failed
        res.json({ // Respond with failure message
          success: false,
          message: "Could not authenticate user."
        });
    })(req, res, next); // Execute authentication middleware
  },
  verifyJWT: (req, res, next) => { // Middleware for verifying JWT token
    let token = req.headers.token; // Get token from request headers
    if (token) { // If token exists
      jsonWebToken.verify(token, "secret_encoding_passphrase", (errors, payload) => { // Verify token
        if (payload) { // If token verified successfully
          User.findById(payload.data).then(user => { // Find user by token data
            if (user) { // If user found
              next(); // Proceed to next middleware
            } else { // If user not found
              res.status(httpStatus.FORBIDDEN).json({ // Respond with error
                error: true,
                message: "No User account found."
              });
            }
          });
        } else { // If token verification failed
          res.status(httpStatus.UNAUTHORIZED).json({ // Respond with error
            error: true,
            message: "Cannot verify API token."
          });
          next(); // Proceed to next middleware
        }
      });
    } else { // If token not provided
      res.status(httpStatus.UNAUTHORIZED).json({ // Respond with error
        error: true,
        message: "Provide Token"
      });
    }
  }
};
