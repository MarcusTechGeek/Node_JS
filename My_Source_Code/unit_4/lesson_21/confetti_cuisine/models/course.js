"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

// Define the schema for the Course model
var courseSchema = new Schema(
  {
    // Define the 'title' field with type String, required, and unique
    title: {
      type: String,
      required: true,
      unique: true
    },
    // Define the 'description' field with type String and required
    description: {
      type: String,
      required: true
    },
    // Define the 'maxStudents' field with type Number, default value 0, and minimum constraint
    maxStudents: {
      type: Number,
      default: 0,
      min: [0, "Course cannot have a negative number of students"]
    },
    // Define the 'cost' field with type Number, default value 0, and minimum constraint
    cost: {
      type: Number,
      default: 0,
      min: [0, "Course cannot have a negative cost"]
    }
  },
  {
    timestamps: true // Automatically add 'createdAt' and 'updatedAt' timestamps
  }
);

// Export the Course model based on the schema
module.exports = mongoose.model("Course", courseSchema);
