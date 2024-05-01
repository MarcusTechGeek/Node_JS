"use strict";

// Import required modules
const mongoose = require("mongoose"),
  { Schema } = mongoose,
  Subscriber = require("./subscriber"),
  bcrypt = require("bcrypt");

// Define user schema
const userSchema = new Schema(
  {
    // Define user's name
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
    // Define user's email
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    // Define user's zip code
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"],
      max: 99999
    },
    // Define user's password
    password: {
      type: String,
      required: true
    },
    // Define user's subscribed courses
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    // Define user's subscribed account
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber"
    }
  },
  // Enable timestamps for user document
  {
    timestamps: true
  }
);

// Define virtual property for user's full name
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

// Middleware to connect user to subscriber account before saving
userSchema.pre("save", function(next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email
    })
      .then(subscriber => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber:${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

// Middleware to hash user's password before saving
userSchema.pre("save", function(next) {
  let user = this;
  bcrypt
    .hash(user.password, 10)
    .then(hash => {
      user.password = hash;
      next();
    })
    .catch(error => {
      console.log(`Error in hashing password: ${error.message}`);
      next(error);
    });
});

// Method to compare user's password with input password
userSchema.methods.passwordComparison = function(inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};

// Export user model
module.exports = mongoose.model("User", userSchema);
