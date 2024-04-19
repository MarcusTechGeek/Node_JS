"use strict";

// Import necessary modules
const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"), // Import error controller module
  homeController = require("./controllers/homeController"), // Import home controller module
  subscribersController = require("./controllers/subscribersController"), // Import subscribers controller module
  layouts = require("express-ejs-layouts"), // Import express-ejs-layouts module
  mongoose = require("mongoose"), // Import mongoose module
  Subscriber = require("./models/subscriber"); // Import Subscriber model

// Set mongoose to use global promise library
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);
const db = mongoose.connection;

// Log successful connection to MongoDB
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// Define a query to find a subscriber with name "Jon Wexler" and email containing "wexler"
var myQuery = Subscriber.findOne({
  name: "Jon Wexler"
}).where("email", /wexler/);

// Execute the query and log the result
myQuery.exec((error, data) => {
  if (data) console.log(data.name);
});

// Set port and view engine for the app
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

// Serve static files from public directory
app.use(express.static("public"));

// Use express-ejs-layouts for rendering layouts
app.use(layouts);

// Parse incoming requests with urlencoded and json middleware
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

// Log request paths
app.use(homeController.logRequestPaths);

// Define routes
app.get("/name", homeController.respondWithName); // Handle GET request for /name route
app.get("/items/:vegetable", homeController.sendReqParam); // Handle GET request for /items/:vegetable route

// Handle GET request for /subscribers route to get all subscribers
app.get("/subscribers", subscribersController.getAllSubscribers, (req, res, next) => {
  res.render("subscribers", { subscribers: req.data }); // Render subscribers view with subscriber data
});

// Other routes
app.get("/", homeController.index); // Handle GET request for root route
app.get("/courses", homeController.showCourses); // Handle GET request for /courses route

// Routes related to subscribers
app.get("/contact", subscribersController.getSubscriptionPage); // Handle GET request for /contact route to show subscription form
app.post("/subscribe", subscribersController.saveSubscriber); // Handle POST request for /subscribe route to save subscriber

// Error handling middleware
app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

// Start the server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
