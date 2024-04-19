"use strict";

// Importing necessary modules
const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts"),
  MongoDB = require("mongodb").MongoClient, // Importing MongoDB client
  dbURL = "mongodb://localhost:27017", // URL of the MongoDB server
  dbName = "recipe_db"; // Name of the database

// Connecting to MongoDB server
MongoDB.connect(
  dbURL,
  (error, client) => {
    if (error) throw error;
    let db = client.db(dbName); // Connecting to the specified database
    // Finding all documents in the 'contacts' collection
    db.collection("contacts")
      .find()
      .toArray((error, data) => {
        if (error) throw error;
        console.log(data); // Logging retrieved data
      });

    // Inserting a new document into the 'contacts' collection
    db.collection("contacts").insert(
      {
        name: "Marcus Gouws",
        email: "Marcus@example.com"
      },
      (error, db) => {
        if (error) throw error;
        console.log(db); // Logging insertion result
      }
    );
  }
);

// Setting the port for the Express application
app.set("port", process.env.PORT || 3000);
// Setting the view engine to EJS
app.set("view engine", "ejs");

// Serving static files from the 'public' directory
app.use(express.static("public"));
// Using express-ejs-layouts for layout management
app.use(layouts);
// Parsing urlencoded request bodies
app.use(
  express.urlencoded({
    extended: false
  })
);
// Parsing JSON request bodies
app.use(express.json());
// Logging request paths
app.use(homeController.logRequestPaths);

// Handling GET request for '/name' route
app.get("/name", homeController.respondWithName);
// Handling GET request for '/items/:vegetable' route
app.get("/items/:vegetable", homeController.sendReqParam);

// Handling POST request to the root route '/'
app.post("/", (req, res) => {
  console.log(req.body); // Logging request body
  console.log(req.query); // Logging query parameters
  res.send("POST Successful!"); // Sending response
});

// Error handling middleware for logging errors
app.use(errorController.logErrors);
// Error handling middleware for responding to resource not found errors
app.use(errorController.respondNoResourceFound);
// Error handling middleware for responding to internal server errors
app.use(errorController.respondInternalError);

// Starting the Express server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
