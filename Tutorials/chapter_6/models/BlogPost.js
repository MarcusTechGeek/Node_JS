// Importing required modules
const mongoose = require('mongoose'); // Mongoose for MongoDB object modeling
const Schema = mongoose.Schema; // Mongoose schema constructor

// Defining a Mongoose schema for a blog post
const BlogPostSchema = new Schema({
    title: String, // Field for the title of the blog post
    body: String, // Field for the body/content of the blog post
    username: { // Field for the username of the author with a default value
        type: String,
        default: 'Marcus Gouws' // Default username
    },
    datePosted: { // Field for the date the post was created with a default value
        type: Date,
        default: new Date() // Default date is set to the current date
    }
});

// Creating a Mongoose model based on the schema
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

// Exporting the BlogPost model to be used in other files
module.exports = BlogPost;
