"use strict";

// Import mongoose module
const mongoose = require("mongoose");

// Import Subscriber model
const Subscriber = require("./models/subscriber");

// Connect to MongoDB database
mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);

// Access mongoose connection
const db = mongoose.connection;

// Define contacts data
var contacts = [
  {
    name: "Jon Wexler",
    email: "jon@jonwexler.com",
    zipCode: 10016
  },
  {
    name: "Chef Eggplant",
    email: "eggplant@recipeapp.com",
    zipCode: 20331
  },
  {
    name: "Professor Souffle",
    email: "souffle@recipeapp.com",
    zipCode: 19103
  }
];

// Delete all documents from Subscriber collection
Subscriber.deleteMany()
  .exec()
  .then(() => {
    console.log("Subscriber data is empty!");
  });

// Array to store commands for creating new subscribers
var commands = [];

// Iterate through each contact and create a Subscriber document
contacts.forEach(c => {
  commands.push(
    Subscriber.create({
      name: c.name,
      email: c.email
    })
  );
});

// Execute all commands asynchronously
Promise.all(commands)
  .then(r => {
    console.log(JSON.stringify(r)); // Log created subscribers
    mongoose.connection.close(); // Close the database connection
  })
  .catch(error => {
    console.log(`ERROR: ${error}`); // Log any errors that occur
  });
