"use strict";

// Import the mongoose module
const mongoose = require("mongoose");

// Define the schema for a subscriber
const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Name is required
  },
  email: {
    type: String,
    required: true, // Email is required
    lowercase: true, // Convert email to lowercase
    unique: true // Email must be unique
  },
  zipCode: {
    type: Number,
    min: [10000, "Zip code too short"], // Zip code must be at least 5 digits
    max: 99999 // Zip code must be less than 100000
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }] // Array of courses subscribed to
});

// Instance method to get subscriber information
subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

// Instance method to find local subscribers based on zip code
subscriberSchema.methods.findLocalSubscribers = function() {
  return this.model("Subscriber")
    .find({ zipCode: this.zipCode }) // Find subscribers with the same zip code
    .exec();
};

// Create and export the Subscriber model based on the subscriber schema
module.exports = mongoose.model("Subscriber", subscriberSchema);
