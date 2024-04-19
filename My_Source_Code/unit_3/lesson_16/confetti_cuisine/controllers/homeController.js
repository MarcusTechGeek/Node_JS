"use strict";

// Array of course objects
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

// Handler to render the courses view with course information
exports.showCourses = (req, res) => {
  res.render("courses", {
    offeredCourses: courses // Pass the courses array to the view
  });
};

// Handler to render the signup form
exports.showSignUp = (req, res) => {
  res.render("contact");
};

// Handler to render the "thanks" view after form submission
exports.postedSignUpForm = (req, res) => {
  res.render("thanks");
};
