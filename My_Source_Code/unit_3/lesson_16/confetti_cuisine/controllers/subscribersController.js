"use strict";

// Import the Subscriber model
const Subscriber = require("../models/subscriber");

// Controller function to retrieve all subscribers
exports.getAllSubscribers = (req, res) => {
  // Find all subscribers in the database
  Subscriber.find({})
    .exec()
    .then(subscribers => {
      // Render the "subscribers" view with the retrieved subscribers
      res.render("subscribers", {
        subscribers: subscribers
      });
    })
    .catch(error => {
      // Handle any errors that occur during the retrieval process
      console.log(error.message);
      return [];
    })
    .then(() => {
      // Log a message indicating that the promise has been completed
      console.log("promise complete");
    });
};

// Controller function to render the subscription page
exports.getSubscriptionPage = (req, res) => {
  // Render the "contact" view
  res.render("contact");
};

// Controller function to save a new subscriber
exports.saveSubscriber = (req, res) => {
  // Create a new Subscriber object with data from the request body
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });
  // Save the new subscriber to the database
  newSubscriber
    .save()
    .then(() => {
      // Render the "thanks" view upon successful save
      res.render("thanks");
    })
    .catch(error => {
      // Send an error response if saving the subscriber fails
      res.send(error);
    });
};
