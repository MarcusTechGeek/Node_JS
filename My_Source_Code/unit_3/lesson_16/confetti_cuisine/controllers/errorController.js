"use strict";

// Import the http-status-codes module
const httpStatus = require("http-status-codes");

// Middleware to handle 404 (page not found) errors
exports.pageNotFoundError = (req, res) => {
  // Set the error code to NOT_FOUND
  let errorCode = httpStatus.NOT_FOUND;
  // Set the response status to the error code
  res.status(errorCode);
  // Render the "error" view
  res.render("error");
};

// Middleware to handle 500 (internal server error) errors
exports.internalServerError = (error, req, res, next) => {
  // Set the error code to INTERNAL_SERVER_ERROR
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  // Log the error stack to the console
  console.log(`ERROR occurred: ${error.stack}`);
  // Set the response status to the error code
  res.status(errorCode);
  // Send an error message as the response
  res.send(`${errorCode} | Sorry, our application is taking a nap!`);
};
