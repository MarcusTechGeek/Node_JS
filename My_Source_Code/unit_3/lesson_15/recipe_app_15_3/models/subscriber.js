"use strict";

// Import the mongoose module
const mongoose = require("mongoose");

// Define the schema for a subscriber
const subscriberSchema = mongoose.Schema({
  name: String,     // Field for the subscriber's name, stored as a string
  email: String,    // Field for the subscriber's email, stored as a string
  zipCode: Number   // Field for the subscriber's zip code, stored as a number
});

// Create and export the Subscriber model based on the subscriber schema
module.exports = mongoose.model("Subscriber", subscriberSchema);
