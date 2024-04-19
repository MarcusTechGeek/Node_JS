"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose;

// Define the schema for the Subscriber model
var subscriberSchema = new Schema(
  {
    // Define the 'name' field with type String and required
    name: {
      type: String,
      required: true
    },
    // Define the 'email' field with type String, required, unique, and lowercase
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    // Define the 'zipCode' field with type Number, with minimum and maximum constraints
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"], // Minimum value for zip code
      max: 99999 // Maximum value for zip code
    },
    // Define the 'courses' field as an array of ObjectIds referencing the 'Course' model
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  {
    timestamps: true // Automatically add 'createdAt' and 'updatedAt' timestamps
  }
);

// Define a method to get subscriber information
subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

// Export the Subscriber model based on the schema
module.exports = mongoose.model("Subscriber", subscriberSchema);
