"use strict";

const mongoose = require("mongoose"), // Importing mongoose library for MongoDB interactions
  { Schema } = mongoose, // Destructuring Schema from mongoose
  Subscriber = require("./subscriber"), // Importing Subscriber model
  bcrypt = require("bcrypt"), // Importing bcrypt for password hashing
  passportLocalMongoose = require("passport-local-mongoose"), // Importing passport-local-mongoose for authentication
  randToken = require("rand-token"), // Importing rand-token for generating random tokens
  userSchema = new Schema( // Defining user schema
    {
      name: { // Sub-schema for name
        first: {
          type: String,
          trim: true
        },
        last: {
          type: String,
          trim: true
        }
      },
      email: { // Email field
        type: String,
        required: true,
        lowercase: true,
        unique: true
      },
      zipCode: { // Zip code field
        type: Number,
        min: [1000, "Zip code too short"],
        max: 99999
      },
      courses: [{ type: Schema.Types.ObjectId, ref: "Course" }], // Reference to enrolled courses
      subscribedAccount: { // Reference to subscribed account (Subscriber model)
        type: Schema.Types.ObjectId,
        ref: "Subscriber"
      }
    },
    {
      timestamps: true // Automatically add timestamps for createdAt and updatedAt
    }
  );

userSchema.virtual("fullName").get(function() { // Virtual property to get full name
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function(next) { // Pre-save hook to associate subscriber account if available
  let user = this;
  if (user.subscribedAccount === undefined) { // If subscriber account is not already associated
    Subscriber.findOne({ // Find subscriber by email
      email: user.email
    })
      .then(subscriber => {
        user.subscribedAccount = subscriber; // Associate subscriber account
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber:${error.message}`); // Log error if subscriber not found
        next(error);
      });
  } else {
    next(); // Proceed if subscriber account already associated
  }
});

userSchema.plugin(passportLocalMongoose, { // Plugin for passport-local-mongoose
  usernameField: "email" // Use email as the username field for authentication
});

module.exports = mongoose.model("User", userSchema); // Exporting User model
