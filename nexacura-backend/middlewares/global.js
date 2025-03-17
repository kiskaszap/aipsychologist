// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");

// class GlobalMiddlewares {
//   constructor(expressApp) {
//     this.app = expressApp;
//     this.setup();
//   }

//   setup() {
//     // CORS setup
//     this.setupCors();

//     // Session setup
//     this.setupSession();

//     // Body parser setup
//     this.setupBodyParser();

//     // JSON verification for webhooks
//     this.setupJsonVerification();

//     // Static files setup (upload folder)
//     this.app.use(express.static("uploads"));

//     // Log all incoming requests to see headers
//     this.app.use((req, res, next) => {
//       console.log(`Incoming request: ${req.method} ${req.url}`);
//       console.log("Received headers:", req.headers);
//       next();
//     });

//     console.log("Global middlewares setup complete.");
//   }

//   setupCors() {
//     // Simple and direct CORS setup
//     this.app.use(
//       cors({
//         origin: [
//           "http://localhost:3000", // Frontend origin
//           // "https://nexacura.chat", // Additional allowed origins
//           // "https://api.openai.com",
//           // "https://api.stripe.com",
//           // "https://hooks.stripe.com",
//         ],
//         credentials: true,
//         methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
//         optionsSuccessStatus: 204,
//         allowedHeaders: [
//           "Content-Type",
//           "Authorization",
//           "X-Requested-With",
//           "Accept",
//           "Origin",
//           "User-Agent",
//         ],
//         // preflightContinue: true,
//       })
//     );
//   }

//   setupSession() {
//     // Session setup using express-session and MongoStore
//     // this.app.use(
//     //   session({
//     //     secret: "12345", // Replace with a more secure secret key in production
//     //     cookie: {
//     //       maxAge: 86400000, // 24 hours
//     //       secure: false, // Set to true if using HTTPS in production
//     //       httpOnly: true,
//     //       sameSite: "None", // Allow cross-origin cookies
//     //     },
//     //     store: MongoStore.create({
//     //       mongoUrl: process.env.MONGODB_URI, // Your MongoDB URI
//     //     }),
//     //     resave: false,
//     //     saveUninitialized: true,
//     //   })
//     // );

//     this.app.use(
//       session({
//         secret: "12345", // Replace with a secure key in production
//         cookie: {
//           maxAge: 86400000, // 24 hours
//           secure: false, // Ensure this is false for local testing (set to true for production with HTTPS)
//           httpOnly: true, // Cookie is not accessible by JavaScript
//           sameSite: "None", // Required for cross-origin cookies
//         },
//         store: MongoStore.create({
//           mongoUrl: process.env.MONGODB_URI, // MongoDB connection URL
//         }),
//         resave: false,
//         saveUninitialized: true,
//       })
//     );
    
//   }

//   setupBodyParser() {
//     // Body parser setup for JSON and URL-encoded data
//     this.app.use(bodyParser.json({ limit: "50mb" }));
//     this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
//   }

//   setupJsonVerification() {
//     // JSON verification for webhook requests (if applicable)
//     this.app.use(
//       express.json({
//         verify: (req, res, buf) => {
//           if (req.originalUrl.startsWith("/webhook")) {
//             req.rawBody = buf.toString();
//           }
//         },
//       })
//     );
//   }
// }

// module.exports = GlobalMiddlewares;

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

    // CORS setup
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
    

    // Allow preflight requests
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