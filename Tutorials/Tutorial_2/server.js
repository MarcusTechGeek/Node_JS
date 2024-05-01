// Importing required modules
const mongoose = require("mongoose"); // Mongoose for MongoDB object modeling
const db = require("./src/models"); // Importing models defined in 'src/models'

// Function to create a new tutorial document
const createTutorial = function(tutorial) {
  return db.Tutorial.create(tutorial).then(docTutorial => {
    console.log("\n>> Created Tutorial:\n", docTutorial);
    return docTutorial;
  });
};

// Function to create a new image document and associate it with a tutorial
const createImage = function(tutorialId, image) {
  return db.Image.create(image).then(docImage => {
    console.log("\n>> Created Image:\n", docImage);
    // Updating the tutorial document to add the newly created image
    return db.Tutorial.findByIdAndUpdate(
      tutorialId,
      {
        $push: {
          images: {
            _id: docImage._id,
            url: docImage.url,
            caption: docImage.caption
          }
        }
      },
      { new: true, useFindAndModify: false }
    );
  });
};

// Function to create a new comment document and associate it with a tutorial
const createComment = function(tutorialId, comment) {
  return db.Comment.create(comment).then(docComment => {
    console.log("\n>> Created Comment:\n", docComment);
    // Updating the tutorial document to add the newly created comment
    return db.Tutorial.findByIdAndUpdate(
      tutorialId,
      { $push: { comments: docComment._id } },
      { new: true, useFindAndModify: false }
    );
  });
};

// Function to create a new category document
const createCategory = function(category) {
  return db.Category.create(category).then(docCategory => {
    console.log("\n>> Created Category:\n", docCategory);
    return docCategory;
  });
};

// Function to associate a tutorial with a category
const addTutorialToCategory = function(tutorialId, categoryId) {
  return db.Tutorial.findByIdAndUpdate(
    tutorialId,
    { category: categoryId },
    { new: true, useFindAndModify: false }
  );
};

// Function to retrieve a tutorial with populated comments and category
const getTutorialWithPopulate = function(id) {
  return db.Tutorial.findById(id)
    .populate("comments", "-_id -__v")
    .populate("category", "name -_id")
    .select("-images._id -__v");
};

// Function to retrieve tutorials in a specific category
const getTutorialsInCategory = function(categoryId) {
  return db.Tutorial.find({ category: categoryId })
    .populate("category", "name -_id")
    .select("-comments -images -__v");
};

// Main function to run all operations
const run = async function() {
  // Creating a new tutorial
  var tutorial = await createTutorial({
    title: "MongoDB One-to-Many Relationship example",
    author: "bezkoder.com"
  });

  // Adding images to the tutorial
  tutorial = await createImage(tutorial._id, {
    path: "sites/uploads/images/mongodb.png",
    url: "https://bezkoder.com/images/mongodb.png",
    caption: "MongoDB Database",
    createdAt: Date.now()
  });
  console.log("\n>> Tutorial:\n", tutorial);

  // Adding comments to the tutorial
  tutorial = await createComment(tutorial._id, {
    username: "jack",
    text: "This is a great tutorial.",
    createdAt: Date.now()
  });
  console.log("\n>> Tutorial:\n", tutorial);

  // Creating a new category
  var category = await createCategory({
    name: "Node.js",
    description: "Node.js tutorial"
  });

  // Associating the tutorial with the category
  tutorial = await addTutorialToCategory(tutorial._id, category._id);
  console.log("\n>> Tutorial:\n", tutorial);

  // Retrieving the tutorial with populated comments and category
  tutorial = await getTutorialWithPopulate(tutorial._id);
  console.log("\n>> populated Tutorial:\n", tutorial);

  // Creating another tutorial and associating it with the same category
  var newTutorial = await createTutorial({
    title: "Mongoose tutorial with examples",
    author: "bezkoder.com"
  });
  await addTutorialToCategory(newTutorial._id, category._id);

  // Retrieving all tutorials in the category
  var tutorials = await getTutorialsInCategory(category._id);
  console.log("\n>> all Tutorials in Category:\n", tutorials);
};

// Connecting to MongoDB database
mongoose
  .connect("mongodb://localhost/bezkoder_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err));

// Running the main function
run();
