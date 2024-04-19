"use strict";

module.exports = {
  // Renders the "contact" view
  getSubscriptionPage: (req, res) => {
    res.render("contact");
  },
  // Renders the "index" view
  index: (req, res) => {
    res.render("index");
  },
  // Logs the URL of the request made to the server and passes control to the next middleware function
  logRequestPaths: (req, res, next) => {
    console.log(`request made to: ${req.url}`);
    next(); // Pass control to the next middleware function
  }
};
