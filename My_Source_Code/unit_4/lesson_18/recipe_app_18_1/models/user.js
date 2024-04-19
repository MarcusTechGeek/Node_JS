"use strict";

// Import the mongoose module
const mongoose = require("mongoose");

// Destructure Schema from mongoose
const { Schema } = mongoose;

// Define the schema for a user
const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true // Trim whitespace from the beginning and end of the string
      },
      last: {
        type: String,
        trim: true
      }
    },
    email: {
      type: String,
      required: true, // Email is required
      lowercase: true, // Convert email to lowercase
      unique: true // Email must be unique
    },
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"], // Zip code must be at least 4 digits
      max: 99999 // Zip code must be less than 100000
    },
    password: {
      type: String,
      required: true // Password is required
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }], // Array of courses enrolled in
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber" // Reference to the subscriber account
    }
  },
  {
    timestamps: true // Enable timestamps for createdAt and updatedAt fields
  }
);

// Define a virtual property for the user's full name
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

// Create and export the User model based on the user schema
module.exports = mongoose.model("User", userSchema);
