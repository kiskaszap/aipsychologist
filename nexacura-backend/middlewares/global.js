

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const passport = require("./passport");

class GlobalMiddlewares {
  constructor(expressApp) {
    this.app = expressApp;
    this.setup();
  }

  setup() {
    // Log incoming requests
    this.app.use((req, res, next) => {
      console.log(`Incoming request: ${req.method} ${req.url}`);
      next();
    });

    this.setupCors();

    // Session setup
    this.setupSession();

    // Initialize Passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Body parser setup
    this.setupBodyParser();

    console.log("Global middlewares setup complete.");
  }

  setupCors() {
    this.app.use(
      cors({
        origin: ["http://localhost:3000", "https://accounts.google.com"], // Frontend origin
        credentials: true, // Allow cookies/session sharing
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "X-Requested-With",
          "Accept",
          "Origin",
          "User-Agent",
        ],
      })
    );
    this.app.options("*", cors());
  }
  setupSession() {
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
          collectionName: "sessions",
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          httpOnly: true,
          secure: false, // Only set to true if using HTTPS
          sameSite: "lax", // SameSite setting
        },
      })
    );
  }

  setupBodyParser() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  }
}

module.exports = GlobalMiddlewares;