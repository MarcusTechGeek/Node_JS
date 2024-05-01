"use strict";

const router = require("express").Router(); // Importing Express Router
const usersController = require("../controllers/usersController"); // Importing Users Controller

// Define routes for user management
router.get("/", usersController.index, usersController.indexView); // Route for fetching all users
router.get("/new", usersController.new); // Route for rendering user creation form
router.post( // Route for creating a new user
  "/create",
  usersController.validate, // Middleware for validating user input
  usersController.create, // Controller for creating user
  usersController.redirectView // Middleware for redirecting after user creation
);
router.get("/login", usersController.login); // Route for rendering login form
router.post("/login", usersController.authenticate); // Route for authenticating user login
router.get("/logout", usersController.logout, usersController.redirectView); // Route for user logout
router.get("/:id/edit", usersController.edit); // Route for rendering user edit form
router.put("/:id/update", usersController.update, usersController.redirectView); // Route for updating user details
router.get("/:id", usersController.show, usersController.showView); // Route for displaying user details
router.delete("/:id/delete", usersController.delete, usersController.redirectView); // Route for deleting user

module.exports = router; // Exporting the router
