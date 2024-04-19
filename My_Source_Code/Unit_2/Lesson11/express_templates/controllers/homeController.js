"use strict";

// Middleware function to log request paths
exports.logRequestPaths = (req, res, next) => {
  console.log(`request made to: ${req.url}`); // Logging the request URL
  next(); // Passing control to the next middleware
};

// Route handler function to send a response with a request parameter
exports.sendReqParam = (req, res) => {
  let veg = req.params.vegetable; // Extracting the vegetable parameter from the request
  res.send(`This is the page for ${veg}`); // Sending a response with the vegetable name
};

// Route handler function to respond with a rendered view
exports.respondWithName = (req, res) => {
  res.render("index"); // Rendering the 'index' view
};
