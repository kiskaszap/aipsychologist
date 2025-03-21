const BaseRoute = require("./BaseRoute");
const passport = require("passport");

class GitHubAuth extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // 🔹 Step 1: Redirect user to GitHub for authentication
    this.router.get(
      "/",
      (req, res, next) => {
        console.log("GitHub auth route called");
        next();
      },
      passport.authenticate("github", { scope: ["user:email"] })
    );

    // 🔹 Step 2: GitHub redirects user back to this callback route
    this.router.get(
      "/callback",
      passport.authenticate("github", { failureRedirect: "/" }),
      async (req, res) => {
        if (!req.user) {
          console.error("GitHub authentication failed: No user object");
          return res.status(401).json({ error: "GitHub authentication failed" });
        }

        console.log("User after GitHub authentication:", req.user);

        // Set session user
        req.session.user = {
          _id: req.user._id,
          user_id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        };

        // Save the session
        req.session.save((err) => {
          if (err) {
            console.error("Session save failed:", err);
            return res.status(500).json({ error: "Session save failed" });
          }

          console.log("Session after GitHub login:", req.session);

          // Redirect to frontend
          res.send(`<script>window.close()</script>`);
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
      console.log("Fetching authenticated GitHub user info:", req.session.user);
      res.json(req.session.user || null);
    });
  }
}

module.exports = GitHubAuth;
