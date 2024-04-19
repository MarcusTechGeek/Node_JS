"use strict";

exports.sendReqParam = (req, res) => {
  let veg = req.params.vegetable; // Extract the value of the "vegetable" parameter from the URL
  res.send(`This is the page for ${veg}`); // Send a response with a message containing the value of the "vegetable" parameter
};

