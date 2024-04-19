const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"), // Import the Subscriber model
  Course = require("./models/course"); // Import the Course model

var testCourse, testSubscriber; // Variables to store test course and test subscriber

// Connect to MongoDB database
mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);

mongoose.Promise = global.Promise; // Set Mongoose Promise to global Promise

// Remove all documents from Subscriber collection
Subscriber.remove({})
  .then(items => console.log(`Removed ${items.n} records!`)) // Log the number of removed records
  .then(() => {
    // Remove all documents from Course collection
    return Course.remove({});
  })
  .then(items => console.log(`Removed ${items.n} records!`)) // Log the number of removed records
  .then(() => {
    // Create a new subscriber
    return Subscriber.create({
      name: "Jon",
      email: "jon@jonwexler.com",
      zipCode: "12345"
    });
  })
  .then(subscriber => {
    // Log the created subscriber information
    console.log(`Created Subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => {
    // Find the created subscriber
    return Subscriber.findOne({
      name: "Jon"
    });
  })
  .then(subscriber => {
    // Store the found subscriber in testSubscriber variable
    testSubscriber = subscriber;
    console.log(`Found one subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => {
    // Create a new course
    return Course.create({
      title: "Tomato Land",
      description: "Locally farmed tomatoes only",
      zipCode: 12345,
      items: ["cherry", "heirloom"]
    });
  })
  .then(course => {
    // Store the created course in testCourse variable
    testCourse = course;
    console.log(`Created course: ${course.title}`);
  })
  .then(() => {
    // Add the created course to the subscriber's courses array and save
    testSubscriber.courses.push(testCourse);
    testSubscriber.save();
  })
  .then(() => {
    // Populate the subscriber's courses
    return Subscriber.populate(testSubscriber, "courses");
  })
  .then(subscriber => console.log(subscriber)) // Log the subscriber with populated courses
  .then(() => {
    // Find subscribers subscribed to the test course
    return Subscriber.find({
      courses: mongoose.Types.ObjectId(testCourse._id)
    });
  })
  .then(subscriber => console.log(subscriber)); // Log the subscribers found
