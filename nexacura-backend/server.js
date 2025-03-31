

const express = require("express");
const app = express();
require("dotenv").config();
const passport = require("passport");
const GlobalMiddlewares = require("./middlewares/global");
const DatabaseConnection = require("./db/DatabaseConnection");
new DatabaseConnection();
const stripe = require("stripe")(process.env.STRIPE_SIGNING_KEY);
const StripeWebhook = require("./routes/WebHook");
app.use("/webhook", express.raw({ type: "application/json" }), (req, res, next) => {
  req.rawBody = req.body; // Store raw body for Stripe verification
  next();
});
new GlobalMiddlewares(app);
app.use(passport.initialize());
app.use(passport.session());
const Registration = require("./routes/Registration");
const Login = require("./routes/Login");
const User = require("./routes/User");
const SpeechToText = require("./routes/SpeechToText");
const ChatSession = require("./routes/ChatSession");
const PastConversation = require("./routes/PastConversation");
const StripeConfig = require("./routes/StripeConfig");
const CheckSubscription = require("./routes/CheckSubscription");
const ResetPassword = require("./routes/ResetPassword");
const NewPassword = require("./routes/NewPassword");
const SubscriptionFocus = require("./routes/SubscriptionFocus");
const Contact = require("./routes/Contact");
const Chatbot = require("./routes/Chatbot");
const GoogleAuth = require("./routes/GoogleAuth");
const WhisperTTSRoute = require("./routes/WhisperTTS");
const AdminDashboard = require("./routes/AdminDashboard");
const Logout = require("./routes/Logout");
const GithubAuth = require("./routes/GithubAuth");

// ✅ WebSocket Setup (Moved to a Route)
const WebSocketRoute = require("./routes/WebsocketRoute");
WebSocketRoute(app); // Pass Express app to manage WebSocket separately

// ✅ Apply Routes
app.use("/registration", new Registration().router);
app.use("/login", new Login().router);
app.use("/user", new User().router);
app.use("/speechToText", new SpeechToText().router);
app.use("/chat", new ChatSession().router);
app.use("/pastConversation", new PastConversation().router);
app.use("/stripe", new StripeConfig().router);
app.use("/checkSubscription", new CheckSubscription().router);
app.use("/webhook", new StripeWebhook().router); // Webhook route
app.use("/reset-password", new ResetPassword().router);
app.use("/new-password", new NewPassword().router);
app.use("/active", new SubscriptionFocus().router);
app.use("/contact", new Contact().router);
app.use("/chatbot", new Chatbot().router);
app.use("/google", new GoogleAuth().router);
app.use("/github", new GithubAuth().router);

app.use("/whisper-tts", new WhisperTTSRoute().router);
app.use("/admin-dashboard", new AdminDashboard().router);
app.use("/logout", new Logout().router);



// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Nexacura");
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
