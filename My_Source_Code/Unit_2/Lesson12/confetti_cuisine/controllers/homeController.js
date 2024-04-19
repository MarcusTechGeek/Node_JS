"use strict";

// Define an array of course objects
var courses = [
  {
    title: "Event Driven Cakes",
    cost: 50
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25
  },
  {
    title: "Object Oriented Orange Juice",
    cost: 10
  }
];

// Function to render the courses page with the list of offered courses
exports.showCourses = (req, res) => {
  res.render("courses", {
    offeredCourses: courses
  });
};

// Function to render the sign-up page
exports.showSignUp = (req, res) => {
  res.render("contact");
};

// Function to render the thank-you page after signing up
exports.postedSignUpForm = (req, res) => {
  res.render("thanks");
};
