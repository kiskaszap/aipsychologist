// const BaseRoute = require("./BaseRoute");
// const passport = require("passport");
// const { OAuth2Client } = require("google-auth-library");
// const User = require("../models/User");

// class GoogleAuth extends BaseRoute {
//   constructor() {
//     super();
//     this.initializeRoutes();
//   }

//   initializeRoutes() {
//     // 🔹 Step 1: Redirect user to Google for authentication
//     this.router.get("/", (req, res, next) => {
//       console.log("google route called"); // Log the route call
//       next(); // Pass control to the next middleware (passport.authenticate)
//     }, passport.authenticate("google", { scope: ["profile", "email"] }));

//     // 🔹 Step 2: Google redirects user back to this callback route
//     this.router.get(
//       "/callback",
//       passport.authenticate("google", { failureRedirect: "/" }),
//       (req, res) => {
//         console.log("User after Google authentication:", req.user);

//         // Ensure the user is authenticated
//         if (!req.user) {
//           console.error("Google authentication failed: No user object");
//           return res.status(401).json({ error: "Google authentication failed" });
//         }

//         // Log the user object for debugging
//         console.log("User after Google authentication:", req.user);

//         // Set session data (same structure as regular login)
//         req.session.user = {
//           _id: req.user._id, // Use _id from the database
//           user_id: req.user._id, // For compatibility
//           name: req.user.name,
//           email: req.user.email,
//           profilePicture: req.user.profilePicture,
//         };

//         // Save the session
//         req.session.save((err) => {
//           if (err) {
//             console.error("Session save failed:", err);
//             return res.status(500).json({ error: "Session save failed" });
//           }

//           console.log("Session after Google login:", req.session);

//           // Redirect to the frontend
//           res.redirect("http://localhost:3000/");
//         });
//       }
//     );

//     // 🔹 Logout route
//     this.router.get("/logout", (req, res) => {
//       req.logout(() => {
//         req.session.destroy(() => {
//           res.redirect("http://localhost:3000/");
//         });
//       });
//     });

//     // 🔹 Get authenticated user info
//     this.router.get("/user", (req, res) => {
//       console.log("Fetching authenticated user info:", req.session.user);
//       res.json(req.session.user || null);
//     });

//     // 🔹 New route: Verify Google ID token
//     this.router.post("/verify-token", async (req, res) => {
//         console.log("google verify token route called");
//         const { token } = req.body;
      
//         if (!token) {
//           console.log("Token is missing");
//           return res.status(400).json({ error: "Token is required" });
//         }
      
//         try {
//           console.log("Verifying Google token:", token);
//           const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
      
//           // Verify the Google ID token
//           const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//           });
      
//           const payload = ticket.getPayload();
//           const { sub, name, email } = payload;
      
//           console.log("Google token payload:", payload);
      
//           // Ellenőrizd, hogy a felhasználó már létezik-e az adatbázisban
//           let user = await User.findOne({ googleId: sub });
//           console.log("User found in database:", user);
      
//           if (!user) {
//             console.log("User not found in database. Creating new user...");
//             // Hozz létre egy új felhasználót
//             user = new User({
//               googleId: sub,
//               name,
//               email,
//             });
//             await user.save();
//             console.log("New user created:", user);
//           }
      
//           // Mentsd a felhasználó adatait a session-be
//           req.session.user = {
//             _id: user._id, // MongoDB ObjectId
//             user_id: user._id, // Kompatibilitás miatt
//             name: user.name,
//             email: user.email,
//           };
      
//           // Mentsd a session-t
//           req.session.save((err) => {
//             if (err) {
//               console.error("Session save failed:", err);
//               return res.status(500).json({ error: "Session save failed" });
//             }
      
//             console.log("Session after Google login:", req.session);
      
//             // Küldd vissza a felhasználó adatait a frontendnek
//             res.json({
//               isAuthenticated: true,
//               message: {
//                 id: sub,
//                 name,
//                 email,
//               },
//             });
//           });
//         } catch (error) {
//           console.error("Google token verification failed:", error);
//           res.status(400).json({ error: "Invalid token" });
//         }
//       });
//   }
// }

// module.exports = GoogleAuth;


const BaseRoute = require("./BaseRoute");
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

class GoogleAuth extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // 🔹 Step 1: Redirect user to Google for authentication
    this.router.get(
      "/",
      (req, res, next) => {
        console.log("google route called"); // Log the route call
        next();
      },
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    // 🔹 Step 2: Google redirects user back to this callback route
    this.router.get(
      "/callback",
      passport.authenticate("google", { failureRedirect: "/" }),
      (req, res) => {
        console.log("User after Google authentication:", req.user);

        if (!req.user) {
          console.error("Google authentication failed: No user object");
          return res.status(401).json({ error: "Google authentication failed" });
        }

        // Set session data
        req.session.user = {
          _id: req.user._id,
          user_id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          profilePicture: req.user.profilePicture,
        };

        // Save session
        req.session.save((err) => {
          if (err) {
            console.error("Session save failed:", err);
            return res.status(500).json({ error: "Session save failed" });
          }

          console.log("Session after Google login:", req.session);
          res.redirect("http://localhost:3000/");
        });
      }
    );

    // 🔹 Logout route
    this.router.get("/logout", (req, res) => {
      req.logout(() => {
        req.session.destroy(() => {
          res.redirect("http://localhost:3000/");
        });
      });
    });

    // 🔹 Get authenticated user info
    this.router.get("/user", (req, res) => {
      console.log("Fetching authenticated user info:", req.session.user);
      res.json(req.session.user || null);
    });

    // 🔹 New route: Verify Google ID token
    this.router.post("/verify-token", async (req, res) => {
      console.log("google verify token route called");
      const { token } = req.body;

      if (!token) {
        console.log("Token is missing");
        return res.status(400).json({ error: "Token is required" });
      }

      try {
        console.log("Verifying Google token:", token);
        const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, name, email } = payload;

        console.log("Google token payload:", payload);

        // 🔍 First, check if a user exists by email
        let user = await User.findOne({ email });

        if (user) {
          // ✅ If user exists but does NOT have a Google ID, update it
          if (!user.googleId) {
            user.googleId = sub;
            await user.save();
            console.log("Updated existing user with Google ID:", user);
          } else {
            console.log("User already exists with Google ID:", user);
          }
        } else {
          // 🆕 If no user is found, create a new one
          console.log("User not found in database. Creating new user...");
          user = new User({
            googleId: sub,
            name,
            email,
          });
          await user.save();
          console.log("New user created:", user);
        }

        // Store user in session
        req.session.user = {
          _id: user._id,
          user_id: user._id,
          name: user.name,
          email: user.email,
        };

        // Save session
        req.session.save((err) => {
          if (err) {
            console.error("Session save failed:", err);
            return res.status(500).json({ error: "Session save failed" });
          }

          console.log("Session after Google login:", req.session);

          // Send response to frontend
          res.json({
            isAuthenticated: true,
            message: {
              id: sub,
              name,
              email,
            },
          });
        });
      } catch (error) {
        console.error("Google token verification failed:", error);
        res.status(400).json({ error: "Invalid token" });
      }
    });
  }
}

module.exports = GoogleAuth;
