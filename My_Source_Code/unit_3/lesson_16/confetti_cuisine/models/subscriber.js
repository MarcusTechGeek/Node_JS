"use strict";

// Import the mongoose module
const mongoose = require("mongoose");

// Define the schema for a subscriber
const subscriberSchema = mongoose.Schema({
  name: String,     // Name of the subscriber, stored as a string
  email: String,    // Email address of the subscriber, stored as a string
  zipCode: Number   // Zip code of the subscriber, stored as a number
});

// Export mongoose model based on the subscriber schema
module.exports = mongoose.model("Subscriber", subscriberSchema);
