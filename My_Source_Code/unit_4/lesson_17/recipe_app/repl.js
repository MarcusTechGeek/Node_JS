const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course");

// Connect to MongoDB
mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

// Remove all subscribers
Subscriber.remove({})
  .then(items => console.log(`Removed ${items.n} records!`))
  .then(() => {
    // Remove all courses
    return Course.remove({});
  })
  .then(items => console.log(`Removed ${items.n} records!`))
  .then(() => {
    // Create a new subscriber
    return Subscriber.create({
      name: "Jon",
      email: "jon@jonwexler.com",
      zipCode: "12345"
    });
  })
  .then(subscriber => {
    console.log(`Created Subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => {
    // Find the created subscriber
    return Subscriber.findOne({
      name: "Jon"
    });
  })
  .then(subscriber => {
    // Store the found subscriber
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
    // Store the created course
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
