/* The GlobalMiddlewares class sets up various middleware functions for an Express application,
including body parsing, cookie parsing, CORS handling, session management, and serving static files. */
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");

class GlobalMiddlewares {
  constructor(expressArguement) {
    this.app = expressArguement;
    this.setup();
  }

  setup() {
    this.app.use(
      cors({
        origin: [
          "https://www.nexacura.chat",
          "https://nexacura.chat",
          "https://6647ee79a4f26b4abdbcf50e--splendorous-belekoy-610158.netlify.app",
        ],
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH", "DELETE"],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
      })
    );
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(cookieParser());
    this.app.use(
      session({
        secret: "12345",
        name: "session",
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false, // Consider using 'true' if you are in a production environment using HTTPS
          maxAge: 24 * 60 * 60 * 1000,
        },
        rolling: true,
      })
    );
    this.app.use(express.static("uploads"));
    this.app.use(
      express.json({
        verify: (req, res, buf) => {
          if (req.originalUrl.startsWith("/webhook")) {
            req.rawBody = buf.toString();
          }
        },
      })
    );
  }
}

module.exports = GlobalMiddlewares;
