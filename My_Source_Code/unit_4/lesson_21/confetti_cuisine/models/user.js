"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  Subscriber = require("./subscriber");

// Define the schema for the User model
var userSchema = new Schema(
  {
    // Define the 'name' field with nested 'first' and 'last' subfields
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
    // Define the 'email' field with type String, required, lowercase, and unique
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    // Define the 'zipCode' field with type Number, min and max constraints
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"],
      max: 99999
    },
    // Define the 'password' field with type String and required
    password: {
      type: String,
      required: true
    },
    // Define the 'subscribedAccount' field as a reference to the Subscriber model
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
    // Define the 'courses' field as an array of references to the Course model
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
  },
  {
    timestamps: true // Automatically add 'createdAt' and 'updatedAt' timestamps
  }
);

// Define a virtual property 'fullName' to concatenate the first and last name
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

// Define a pre-save hook to connect a user to a subscriber if not already connected
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
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

// Export the User model based on the schema
module.exports = mongoose.model("User", userSchema);
