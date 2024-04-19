"use strict";

// Import required modules
const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"), // Import error controller module
  homeController = require("./controllers/homeController"), // Import home controller module
  layouts = require("express-ejs-layouts"), // Import express-ejs-layouts module
  mongoose = require("mongoose"), // Import mongoose module
  Subscriber = require("./models/subscriber"); // Import Subscriber model

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

// Create new subscriber object and save to MongoDB
// var subscriber1 = new Subscriber({
//   name: "Jon Wexler",
//   email: "jon@jonwexler.com"
// });
// subscriber1.save((error, savedDocument) => {
//   if (error) console.log(error);
//   console.log(savedDocument);
// });

// Create new subscriber using Subscriber.create method
// Subscriber.create(
//   {
//     name: "Jon2 Wexler",
//     email: "jon222@jonwexler.com"
//   },
//   function (error, savedDocument) {
//     if (error) console.log(error);
//     console.log(savedDocument);
//   }
// );

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

// Handle POST request for root route
app.post("/", (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send("POST Successful!");
});

// Error handling middleware
app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

// Start the server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
