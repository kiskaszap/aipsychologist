// Import the express package
const express = require("express")();
// Import the global middlewares
const GlobalMiddlewares = require("./middlewares/global");
// Import the dotenv package
require("dotenv").config();
// Import the database connection
const DatabaseConnection = require("./db/DatabaseConnection");
// Import the routes
const registration = require("./routes/Registration");
const login = require("./routes/Login");
const User = require("./routes/User");
const SpeechToText = require("./routes/SpeechToText");

// instantiate the global middlewares
new GlobalMiddlewares(express);
// instantiate the database connection
new DatabaseConnection();
// // create a route for the registration page
express.use("/registration", new registration().router);
express.use("/login", new login().router);
express.use("/user", new User().router);
express.use("/speechToText", new SpeechToText().router);

// create a route for the home page
express.get("/", (req, res) => {
  res.send("Welcome to Nexacura");
});

const PORT = process.env.PORT || 4000;
express.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
