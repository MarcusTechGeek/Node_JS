"use strict";

const httpStatus = require("http-status-codes");

// Route handler function to respond with a 404 (Not Found) error page
exports.pageNotFoundError = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND; // Setting the error code to 404
  res.status(errorCode); // Setting the response status code
  res.render("error"); // Rendering the 'error' view
};

// Route handler function to respond with a 500 (Internal Server Error) error page
exports.internalServerError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // Setting the error code to 500
  console.log(`ERROR occurred: ${error.stack}`); // Logging the error stack trace
  res.status(errorCode); // Setting the response status code
  res.send(`${errorCode} | Sorry, our application is taking a nap!`); // Sending an error message
};
