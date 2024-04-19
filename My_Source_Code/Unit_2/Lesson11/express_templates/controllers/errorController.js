"use strict";

const httpStatus = require("http-status-codes");

// Middleware function to log errors
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Logging the error stack trace
  next(error); // Passing the error to the next middleware
};

// Middleware function to respond to resource not found errors (404)
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND; // Setting the error code to 404
  res.status(errorCode); // Setting the response status code
  res.send(`${errorCode} | The page does not exist!`); // Sending an error message
};

// Middleware function to respond to internal server errors (500)
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // Setting the error code to 500
  console.log(`ERROR occurred: ${error.stack}`); // Logging the error stack trace
  res.status(errorCode); // Setting the response status code
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`); // Sending an error message
};
