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
const ChatSession = require("./routes/ChatSession");
const PastConversation = require("./routes/PastConversation");
const StripeConfig = require("./routes/StripeConfig");
const StripeWebhook = require("./routes/WebHook");
const CheckSubscription = require("./routes/CheckSubscription");
const ResetPassword = require("./routes/ResetPassword");
const NewPassword = require("./routes/NewPassword");
const SubscriptionFocus = require("./routes/SubscriptionFocus");
const Contact = require("./routes/Contact");
const Chatbot = require("./routes/Chatbot");

express.use("/webhook", new StripeWebhook().router);
// instantiate the global middlewares
new GlobalMiddlewares(express);
// instantiate the database connection
new DatabaseConnection();
// // create a route for the registration page
express.use("/registration", new registration().router);
express.use("/login", new login().router);
express.use("/user", new User().router);
express.use("/speechToText", new SpeechToText().router);
express.use("/chat", new ChatSession().router);
express.use("/pastConversation", new PastConversation().router);
express.use("/stripe", new StripeConfig().router);
express.use("/checkSubscription", new CheckSubscription().router);
express.use("/reset-password", new ResetPassword().router);
express.use("/new-password", new NewPassword().router);
express.use("/active", new SubscriptionFocus().router);
express.use("/contact", new Contact().router);
express.use("/chatbot", new Chatbot().router);

// create a route for the home page
express.get("/", (req, res) => {
  res.send("Welcome to Nexacura");
});

const PORT = process.env.PORT || 4000;
express.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
