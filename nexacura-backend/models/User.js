/* This code snippet is setting up a schema and model for a MongoDB collection called "users" using
Mongoose, which is an Object Data Modeling (ODM) library for MongoDB and Node.js. Here's a breakdown
of what each part of the code is doing: */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profession: String,
  bio: String,
  image: String,
  googleId: String,
  githubId: String,
  subscription: {
    type: {
      type: String, // Type of subscription (e.g., 'hourly', 'weekly', 'monthly')
      enum: ["hourly", "weekly", "monthly"],
    },
    expiry: Date, // When does the subscription expire
    active: {
      type: Boolean, // Is the subscription currently active
      default: false,
    },
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
