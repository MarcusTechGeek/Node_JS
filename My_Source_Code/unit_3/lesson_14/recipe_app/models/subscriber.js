"use strict";

// Import mongoose module
const mongoose = require("mongoose");

// Define subscriber schema using mongoose.Schema
const subscriberSchema = mongoose.Schema({
  name: String,     // Define name field as String type
  email: String,    // Define email field as String type
  zipCode: Number   // Define zipCode field as Number type
});

// Export mongoose model based on the subscriber schema
module.exports = mongoose.model("Subscriber", subscriberSchema);
