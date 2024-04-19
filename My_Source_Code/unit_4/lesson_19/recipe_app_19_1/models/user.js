"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose, // Destructuring assignment to extract Schema from mongoose
  Subscriber = require("./subscriber"), // Importing Subscriber model
  userSchema = new Schema(
    {
      name: {
        first: {
          type: String,
          trim: true
        },
        last: {
          type: String,
          trim: true
        }
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
      },
      zipCode: {
        type: Number,
        min: [1000, "Zip code too short"],
        max: 99999
      },
      password: {
        type: String,
        required: true
      },
      courses: [{ type: Schema.Types.ObjectId, ref: "Course" }], // Reference to Course model
      subscribedAccount: {
        type: Schema.Types.ObjectId,
        ref: "Subscriber" // Reference to Subscriber model
      }
    },
    {
      timestamps: true // Automatically adds createdAt and updatedAt fields
    }
  );

// Virtual property to get the full name of the user
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

// Pre-save middleware to connect the user to a subscriber account if one exists with the same email
userSchema.pre("save", function(next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    // Check if subscribedAccount is not defined
    Subscriber.findOne({
      email: user.email
    })
      .then(subscriber => {
        user.subscribedAccount = subscriber; // Assign the found subscriber to the user's subscribedAccount
        next(); // Proceed to save
      })
      .catch(error => {
        console.log(`Error in connecting subscriber:${error.message}`);
        next(error); // Pass error to the next middleware
      });
  } else {
    next(); // If subscribedAccount is defined, proceed to save
  }
});

module.exports = mongoose.model("User", userSchema); // Export the User model
