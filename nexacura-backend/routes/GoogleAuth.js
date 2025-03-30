
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
    this.router.get(
      "/",
      (req, res, next) => {
        console.log("google route called"); // Log the route call
        next();
      },
      passport.authenticate("google", { scope: ["profile", "email"] })
    );
    this.router.get(
      "/callback",
      passport.authenticate("google", { failureRedirect: "/" }),
      (req, res) => {
        if (!req.user) {
          return res.status(401).json({ error: "Google authentication failed" });
        }
        req.session.user = {
          _id: req.user._id,
          user_id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          profilePicture: req.user.profilePicture,
        };
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
    this.router.get("/user", (req, res) => {
      console.log("Fetching authenticated user info:", req.session.user);
      res.json(req.session.user || null);
    });
    this.router.post("/verify-token", async (req, res) => {
      console.log("google verify token route called");
      const { token } = req.body;
      if (!token) {
        console.log("Token is missing");
        return res.status(400).json({ error: "Token is required" });
      }
      try {
        const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, name, email } = payload;
        let user = await User.findOne({ email });
        if (user) {
          if (!user.googleId) {
            user.googleId = sub;
            await user.save();
            console.log("Updated existing user with Google ID:", user);
          } else {
            console.log("User already exists with Google ID:", user);
          }
        } else {
          user = new User({
            googleId: sub,
            name,
            email,
          });
          await user.save();
        }
        req.session.user = {
          _id: user._id,
          user_id: user._id,
          name: user.name,
          email: user.email,
        };
        req.session.save((err) => {
          if (err) {
            console.error("Session save failed:", err);
            return res.status(500).json({ error: "Session save failed" });
          }
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
